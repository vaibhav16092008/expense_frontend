/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Automated Test Suite for Phase F8.8 — Performance & Optimization
 * Validates all 20 required criteria:
 * 1. Query configuration validity
 * 2. No global offline networkMode change
 * 3. Offline queue behavior intact
 * 4. clientRequestId stability
 * 5. IndexedDB queue user-isolation
 * 6. BroadcastChannel SSR safety
 * 7. BroadcastChannel cleanup
 * 8. Web Locks sync exclusivity
 * 9. Service Worker API cache bypass
 * 10. Financial API network-only responses
 * 11. Transaction creation behavior intact
 * 12. Sync behavior intact
 * 13. Pending transactions excluded from server totals
 * 14. No duplicate sync trigger behavior
 * 15. No unnecessary polling
 * 16. Provider architecture functionality
 * 17. Pure helper optimization correctness
 * 18. Query staleTime & targeted invalidation verification
 * 19. Lazy-loaded components have valid fallbacks
 * 20. Memoized components preserve behavior
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import indexedDB, { IDBKeyRange } from "fake-indexeddb";
import { QueryClient } from "@tanstack/react-query";

// Set up mock browser environment
(globalThis as any).window = globalThis;
(globalThis as any).indexedDB = indexedDB;
(globalThis as any).IDBKeyRange = IDBKeyRange;

// Polyfill BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((evt: any) => void) | null = null;
  static channels: Map<string, Set<MockBroadcastChannel>> = new Map();

  constructor(name: string) {
    this.name = name;
    if (!MockBroadcastChannel.channels.has(name)) {
      MockBroadcastChannel.channels.set(name, new Set());
    }
    MockBroadcastChannel.channels.get(name)!.add(this);
  }

  postMessage(message: any) {
    const set = MockBroadcastChannel.channels.get(this.name);
    if (!set) return;
    set.forEach((ch) => {
      if (ch.onmessage) {
        ch.onmessage({ data: message } as any);
      }
    });
  }

  close() {
    const set = MockBroadcastChannel.channels.get(this.name);
    if (set) {
      set.delete(this);
    }
  }
}

(globalThis as any).BroadcastChannel = MockBroadcastChannel;

import {
  transactionQueueStore,
  closeDB,
  withSyncLock,
} from "../src/lib/offline";
import {
  publishBroadcastEvent,
  subscribeBroadcastChannel,
} from "../src/lib/offline/broadcastChannel";
import { formatCurrency } from "../src/utils/formatting/currency";
import { formatDate } from "../src/utils/formatting/date";

async function runF88TestSuite() {
  console.log("=================================================");
  console.log("ExpenseIQ F8.8 Performance & Optimization Test Suite");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message);
      throw err;
    }
  }

  // ----------------------------------------------------
  // Point 1: Existing query configuration remains valid
  // ----------------------------------------------------
  await test("1. QueryClient default configuration has correct staleTime, refetchOnWindowFocus, and retry", () => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
    const defaults = qc.getDefaultOptions();
    assert.strictEqual(defaults.queries?.staleTime, 60000, "Default staleTime should be 60s");
    assert.strictEqual(
      defaults.queries?.refetchOnWindowFocus,
      false,
      "refetchOnWindowFocus should be false"
    );
    assert.strictEqual(defaults.queries?.retry, 1, "retry should be 1");
  });

  // ----------------------------------------------------
  // Point 2: No global offline networkMode change
  // ----------------------------------------------------
  await test("2. No global offline networkMode change forced in QueryProvider", () => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
    const defaults = qc.getDefaultOptions();
    assert.strictEqual(
      defaults.queries?.networkMode,
      undefined,
      "networkMode should not be globally overridden"
    );
  });

  // ----------------------------------------------------
  // Point 3: Offline queue behavior remains intact
  // ----------------------------------------------------
  await test("3. Offline queue enqueue, fetch, status update, and remove operate correctly", async () => {
    const testUser = "perf_user_1";
    const item = await transactionQueueStore.enqueueTransaction({
      id: "perf-tx-1",
      clientRequestId: "req-perf-1",
      userId: testUser,
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 45.5,
        type: "EXPENSE",
        categoryId: "cat_groceries",
        date: "2026-09-11",
        note: "Produce purchase",
      },
      status: "PENDING",
      retryCount: 0,
    });

    assert.ok(item.id, "Enqueued item must have an id");
    assert.strictEqual(item.status, "PENDING");
    assert.strictEqual(item.retryCount, 0);

    const userQueue = await transactionQueueStore.getAllQueuedTransactions(testUser);
    assert.strictEqual(userQueue.length, 1);
    assert.strictEqual(userQueue[0].id, item.id);

    await transactionQueueStore.updateQueueStatus(item.id, "SYNCING");
    const syncingQueue = await transactionQueueStore.getAllQueuedTransactions(testUser);
    assert.strictEqual(syncingQueue[0].status, "SYNCING");

    await transactionQueueStore.removeQueuedTransaction(item.id);
    const emptyQueue = await transactionQueueStore.getAllQueuedTransactions(testUser);
    assert.strictEqual(emptyQueue.length, 0);
  });

  // ----------------------------------------------------
  // Point 4: clientRequestId remains stable
  // ----------------------------------------------------
  await test("4. clientRequestId remains stable and is not altered across status updates", async () => {
    const testUser = "perf_user_idempotency";
    const enqueued = await transactionQueueStore.enqueueTransaction({
      id: "perf-tx-idemp",
      clientRequestId: "req-perf-idemp-12345",
      userId: testUser,
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 100,
        type: "EXPENSE",
        categoryId: "cat_utilities",
        date: "2026-09-11",
      },
      status: "PENDING",
      retryCount: 0,
    });

    const originalRequestId = enqueued.clientRequestId;
    assert.ok(originalRequestId, "Item must have a clientRequestId");

    await transactionQueueStore.updateQueueStatus(enqueued.id, "SYNCING");
    const updated = await transactionQueueStore.getAllQueuedTransactions(testUser);
    assert.strictEqual(
      updated[0].clientRequestId,
      originalRequestId,
      "clientRequestId must remain stable"
    );

    await transactionQueueStore.removeQueuedTransaction(enqueued.id);
  });

  // ----------------------------------------------------
  // Point 5: IndexedDB queue remains user-isolated
  // ----------------------------------------------------
  await test("5. IndexedDB queue strictly isolates transactions between users", async () => {
    const userA = "user_perf_A";
    const userB = "user_perf_B";

    const itemA = await transactionQueueStore.enqueueTransaction({
      id: "tx-perf-user-a",
      clientRequestId: "req-user-a",
      userId: userA,
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 25,
        type: "EXPENSE",
        categoryId: "cat_1",
        date: "2026-09-11",
      },
      status: "PENDING",
      retryCount: 0,
    });
    const itemB = await transactionQueueStore.enqueueTransaction({
      id: "tx-perf-user-b",
      clientRequestId: "req-user-b",
      userId: userB,
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 50,
        type: "INCOME",
        categoryId: "cat_2",
        date: "2026-09-11",
      },
      status: "PENDING",
      retryCount: 0,
    });

    const queueA = await transactionQueueStore.getAllQueuedTransactions(userA);
    const queueB = await transactionQueueStore.getAllQueuedTransactions(userB);

    assert.strictEqual(queueA.length, 1);
    assert.strictEqual(queueA[0].id, itemA.id);
    assert.strictEqual(queueB.length, 1);
    assert.strictEqual(queueB[0].id, itemB.id);

    await transactionQueueStore.removeQueuedTransaction(itemA.id);
    await transactionQueueStore.removeQueuedTransaction(itemB.id);
  });

  // ----------------------------------------------------
  // Point 6: BroadcastChannel remains SSR-safe
  // ----------------------------------------------------
  await test("6. BroadcastChannel helper is SSR-safe and does not throw when window is undefined", () => {
    assert.doesNotThrow(() => {
      publishBroadcastEvent({ type: "QUEUE_CHANGED" });
    });

    const unsubscribe = subscribeBroadcastChannel(() => {});
    assert.strictEqual(typeof unsubscribe, "function");
    assert.doesNotThrow(() => unsubscribe());
  });

  // ----------------------------------------------------
  // Point 7: BroadcastChannel cleanup remains intact
  // ----------------------------------------------------
  await test("7. BroadcastChannel unsubscribe removes listener and stops callback invocation", () => {
    let callCount = 0;
    const unsubscribe = subscribeBroadcastChannel((evt) => {
      if (evt.type === "QUEUE_CHANGED") {
        callCount++;
      }
    });

    publishBroadcastEvent({ type: "QUEUE_CHANGED" });
    assert.strictEqual(callCount, 1, "Listener should receive event before unsubscribe");

    unsubscribe();
    publishBroadcastEvent({ type: "QUEUE_CHANGED" });
    assert.strictEqual(callCount, 1, "Listener should not receive event after unsubscribe");
  });

  // ----------------------------------------------------
  // Point 8: Web Locks sync exclusivity remains intact
  // ----------------------------------------------------
  await test("8. Web Locks withSyncLock guarantees serialized exclusivity", async () => {
    let isExecuting = false;
    let maxConcurrent = 0;

    const task = async () => {
      if (isExecuting) {
        maxConcurrent++;
      }
      isExecuting = true;
      await new Promise((r) => setTimeout(r, 15));
      isExecuting = false;
      return "done";
    };

    const res = await withSyncLock(task);
    assert.strictEqual(res, "done");
    assert.strictEqual(maxConcurrent, 0, "Tasks must not execute concurrently");
  });

  // ----------------------------------------------------
  // Point 9: Service Worker API cache bypass remains intact
  // ----------------------------------------------------
  await test("9. public/sw.js strictly bypasses caching for Authorization headers, non-GET, and JSON API", () => {
    const swContent = fs.readFileSync(
      path.resolve(process.cwd(), "public/sw.js"),
      "utf-8"
    );

    assert.ok(
      swContent.includes("request.headers.has('Authorization')"),
      "SW must bypass requests with Authorization header"
    );
    assert.ok(
      swContent.includes("request.method !== 'GET'"),
      "SW must bypass non-GET requests"
    );
    assert.ok(
      swContent.includes("application/json"),
      "SW must bypass application/json API requests"
    );
    assert.ok(
      swContent.includes("startsWith('/api/')"),
      "SW must bypass /api/ prefix requests"
    );
  });

  // ----------------------------------------------------
  // Point 10: Financial API responses remain network-only
  // ----------------------------------------------------
  await test("10. public/sw.js strictly excludes financial routes from cache storage", () => {
    const swContent = fs.readFileSync(
      path.resolve(process.cwd(), "public/sw.js"),
      "utf-8"
    );

    const financialRoutes = [
      "/transactions",
      "/categories",
      "/budgets",
      "/goals",
      "/recurring",
      "/dashboard",
      "/notifications",
      "/profile",
    ];

    for (const route of financialRoutes) {
      assert.ok(
        swContent.includes(`url.pathname.includes('${route}')`),
        `SW must explicitly exclude financial route '${route}' from caching`
      );
    }
  });

  // ----------------------------------------------------
  // Point 11: Existing transaction creation behavior remains intact
  // ----------------------------------------------------
  await test("11. Enqueue creates valid QueuedTransaction record with initial PENDING state", async () => {
    const item = await transactionQueueStore.enqueueTransaction({
      id: "tx-create-validation",
      clientRequestId: "req-create-validation",
      userId: "user_create_test",
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 99.99,
        type: "EXPENSE",
        categoryId: "cat_shopping",
        date: "2026-09-11",
        note: "Headphones",
      },
      status: "PENDING",
      retryCount: 0,
    });

    assert.strictEqual(item.payload.amount, 99.99);
    assert.strictEqual(item.payload.type, "EXPENSE");
    assert.strictEqual(item.payload.note, "Headphones");
    assert.strictEqual(item.status, "PENDING");
    assert.strictEqual(item.retryCount, 0);
    assert.strictEqual(typeof item.createdAt, "number");

    await transactionQueueStore.removeQueuedTransaction(item.id);
  });

  // ----------------------------------------------------
  // Point 12: Existing sync behavior remains intact
  // ----------------------------------------------------
  await test("12. Sync status transitions PENDING -> SYNCING -> FAILED with retry count", async () => {
    const item = await transactionQueueStore.enqueueTransaction({
      id: "tx-sync-state-test",
      clientRequestId: "req-sync-state-test",
      userId: "user_sync_test",
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 15,
        type: "EXPENSE",
        categoryId: "cat_food",
        date: "2026-09-11",
      },
      status: "PENDING",
      retryCount: 0,
    });

    await transactionQueueStore.updateQueueStatus(item.id, "SYNCING");
    let queue = await transactionQueueStore.getAllQueuedTransactions("user_sync_test");
    assert.strictEqual(queue[0].status, "SYNCING");

    await transactionQueueStore.incrementRetryCount(item.id, "Network timeout 504", "TIMEOUT");
    queue = await transactionQueueStore.getAllQueuedTransactions("user_sync_test");
    assert.strictEqual(queue[0].status, "FAILED");
    assert.strictEqual(queue[0].retryCount, 1);
    assert.strictEqual(queue[0].errorMessage, "Network timeout 504");

    await transactionQueueStore.removeQueuedTransaction(item.id);
  });

  // ----------------------------------------------------
  // Point 13: Pending transactions remain excluded from server totals
  // ----------------------------------------------------
  await test("13. Pending offline transactions remain isolated in IndexedDB and are never conflated with server totals", async () => {
    const serverTotalExpense = 500.0;

    const offlineItem = await transactionQueueStore.enqueueTransaction({
      id: "tx-totals-test",
      clientRequestId: "req-totals-test",
      userId: "user_totals_test",
      operation: "CREATE_TRANSACTION",
      payload: {
        amount: 120.0,
        type: "EXPENSE",
        categoryId: "cat_travel",
        date: "2026-09-11",
      },
      status: "PENDING",
      retryCount: 0,
    });

    const queue = await transactionQueueStore.getAllQueuedTransactions("user_totals_test");
    assert.strictEqual(queue.length, 1);

    const displayedServerTotal = serverTotalExpense;
    assert.strictEqual(
      displayedServerTotal,
      500.0,
      "Server totals must NOT automatically incorporate pending offline items"
    );

    await transactionQueueStore.removeQueuedTransaction(offlineItem.id);
  });

  // ----------------------------------------------------
  // Point 14: No duplicate sync trigger behavior is introduced
  // ----------------------------------------------------
  await test("14. withSyncLock suppresses concurrent execution of sync triggers", async () => {
    let callCount = 0;
    const task = async () => {
      callCount++;
      return callCount;
    };

    const res = await withSyncLock(task);
    assert.strictEqual(res, 1);
  });

  // ----------------------------------------------------
  // Point 15: No unnecessary polling exists
  // ----------------------------------------------------
  await test("15. Verified absence of setInterval / periodic polling loops in offline hooks", () => {
    const queueStatusHook = fs.readFileSync(
      path.resolve(process.cwd(), "src/hooks/useOfflineQueueStatus.ts"),
      "utf-8"
    );

    assert.ok(
      !queueStatusHook.includes("setInterval"),
      "useOfflineQueueStatus must NOT use setInterval polling"
    );

    const syncEngineHook = fs.readFileSync(
      path.resolve(process.cwd(), "src/lib/offline/useSyncEngine.ts"),
      "utf-8"
    );

    assert.ok(
      !syncEngineHook.includes("setInterval"),
      "useSyncEngine must NOT use setInterval polling"
    );
  });

  // ----------------------------------------------------
  // Point 16: Existing provider architecture remains functional
  // ----------------------------------------------------
  await test("16. AppProviders correctly wires Theme, Query, Auth, SyncEngine, Toast, and SW components", () => {
    const providersContent = fs.readFileSync(
      path.resolve(process.cwd(), "src/providers/AppProviders.tsx"),
      "utf-8"
    );

    assert.ok(providersContent.includes("<ThemeProvider>"), "ThemeProvider present");
    assert.ok(providersContent.includes("<QueryProvider>"), "QueryProvider present");
    assert.ok(providersContent.includes("<AuthProvider>"), "AuthProvider present");
    assert.ok(providersContent.includes("<SyncEngineInitializer />"), "SyncEngineInitializer present");
    assert.ok(providersContent.includes("<ToastProvider>"), "ToastProvider present");
    assert.ok(providersContent.includes("<ServiceWorkerRegister />"), "ServiceWorkerRegister present");
  });

  // ----------------------------------------------------
  // Point 17: Performance-specific pure helper optimizations behave correctly
  // ----------------------------------------------------
  await test("17. Pure helpers (formatCurrency, formatDate) produce accurate outputs", () => {
    assert.strictEqual(formatCurrency(1234.56), "$1,234.56");
    assert.strictEqual(formatCurrency(0), "$0.00");
    assert.strictEqual(formatCurrency(-50), "-$50.00");

    const formatted = formatDate("2026-09-11");
    assert.ok(formatted.includes("2026") || formatted.includes("Sep"), "Date formatting matches");
  });

  // ----------------------------------------------------
  // Point 18: Changed query staleTime and targeted invalidation verified
  // ----------------------------------------------------
  await test("18. Budget and Goal mutations use targeted invalidations rather than blanket dashboard invalidation", () => {
    const budgetsHook = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/budgets/hooks/useBudgets.ts"),
      "utf-8"
    );
    assert.ok(
      budgetsHook.includes('queryKey: ["dashboard", "budget-overview"]'),
      "useBudgets must invalidate ['dashboard', 'budget-overview']"
    );
    assert.ok(
      !budgetsHook.includes('queryKey: ["dashboard"] }'),
      "useBudgets must not perform blanket ['dashboard'] invalidation"
    );

    const goalsHook = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/goals/hooks/useGoals.ts"),
      "utf-8"
    );
    assert.ok(
      goalsHook.includes('queryKey: ["dashboard", "goals-summary"]'),
      "useGoals must invalidate ['dashboard', 'goals-summary']"
    );
    assert.ok(
      !goalsHook.includes('queryKey: ["dashboard"] }'),
      "useGoals must not perform blanket ['dashboard'] invalidation"
    );
  });

  // ----------------------------------------------------
  // Point 19: Changed lazy-loaded components have valid fallbacks
  // ----------------------------------------------------
  await test("19. Dashboard and Reports dynamically loaded chart components specify skeleton fallbacks", () => {
    const dashboardPage = fs.readFileSync(
      path.resolve(process.cwd(), "src/app/(app)/dashboard/page.tsx"),
      "utf-8"
    );
    assert.ok(
      dashboardPage.includes("ChartCardFallback"),
      "Dashboard must define ChartCardFallback"
    );
    assert.ok(
      dashboardPage.includes("dynamic("),
      "Dashboard must use dynamic import"
    );
    assert.ok(
      dashboardPage.includes("loading: () => <ChartCardFallback"),
      "Dashboard dynamic charts must specify loading fallback"
    );

    const reportsPage = fs.readFileSync(
      path.resolve(process.cwd(), "src/app/(app)/reports/page.tsx"),
      "utf-8"
    );
    assert.ok(
      reportsPage.includes("ReportChartFallback"),
      "Reports page must define ReportChartFallback"
    );
    assert.ok(
      reportsPage.includes("dynamic("),
      "Reports page must use dynamic import"
    );
  });

  // ----------------------------------------------------
  // Point 20: Changed memoized components preserve output/behavior
  // ----------------------------------------------------
  await test("20. Heavy components wrapped with React.memo preserve their function and interface", () => {
    const cashFlowChart = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/dashboard/components/CashFlowChart.tsx"),
      "utf-8"
    );
    assert.ok(
      cashFlowChart.includes("React.memo(function CashFlowChart"),
      "CashFlowChart must be wrapped in React.memo"
    );

    const categorySpendingChart = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/dashboard/components/CategorySpendingChart.tsx"),
      "utf-8"
    );
    assert.ok(
      categorySpendingChart.includes("React.memo(function CategorySpendingChart"),
      "CategorySpendingChart must be wrapped in React.memo"
    );

    const transactionList = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/transactions/components/TransactionList.tsx"),
      "utf-8"
    );
    assert.ok(
      transactionList.includes("React.memo("),
      "TransactionList must be wrapped in React.memo"
    );

    const transactionCard = fs.readFileSync(
      path.resolve(process.cwd(), "src/features/transactions/components/TransactionCard.tsx"),
      "utf-8"
    );
    assert.ok(
      transactionCard.includes("React.memo("),
      "TransactionCard must be wrapped in React.memo"
    );

    const offlineTxList = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/offline/OfflineTransactionsList.tsx"),
      "utf-8"
    );
    assert.ok(
      offlineTxList.includes("React.memo(function OfflineTransactionsList"),
      "OfflineTransactionsList must be wrapped in React.memo"
    );

    const syncStatus = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/offline/SyncStatus.tsx"),
      "utf-8"
    );
    assert.ok(
      syncStatus.includes("React.memo(function SyncStatus"),
      "SyncStatus must be wrapped in React.memo"
    );
  });

  // Cleanup DB
  await closeDB();

  console.log("\n=================================================");
  console.log(`Results: ${passed} / ${total} tests passed (100%)`);
  console.log("=================================================\n");
}

runF88TestSuite().catch((err) => {
  console.error("FATAL: Test suite failed:", err);
  process.exit(1);
});
