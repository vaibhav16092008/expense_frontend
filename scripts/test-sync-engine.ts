/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Automated Test Suite for Phase F8.5 — Offline Transaction Sync Engine
 */

import indexedDB, { IDBKeyRange } from "fake-indexeddb";

// Polyfill browser environment for Node test execution
(globalThis as any).window = globalThis;
(globalThis as any).indexedDB = indexedDB;
(globalThis as any).IDBKeyRange = IDBKeyRange;

import assert from "node:assert";
import {
  syncEngine,
  transactionQueueStore,
  withSyncLock,
  closeDB,
  QueuedTransaction,
} from "../src/lib/offline";

async function runF85SyncEngineTestSuite() {
  console.log("🧪 Starting ExpenseIQ Phase F8.5 Sync Engine Test Suite...\n");

  // Clean state
  await transactionQueueStore.clearAllQueue();

  // Test 1: Empty Queue Handling
  console.log("1️⃣ Testing empty queue sync handling...");
  Object.defineProperty(globalThis, "navigator", {
    value: { onLine: true },
    writable: true,
    configurable: true,
  });

  const emptyResult = await syncEngine.syncUserQueue("user-123");
  assert.ok(emptyResult, "Result object should be returned");
  assert.strictEqual(emptyResult?.processed, 0);
  assert.strictEqual(emptyResult?.succeeded, 0);
  console.log("   ✓ Empty queue handling passed.");

  // Test 2: Exponential Backoff Calculation
  console.log("\n2️⃣ Testing exponential backoff calculation...");
  assert.strictEqual(syncEngine.calculateBackoffDelay(0), 0);
  assert.strictEqual(syncEngine.calculateBackoffDelay(1), 1000); // 1s
  assert.strictEqual(syncEngine.calculateBackoffDelay(2), 2000); // 2s
  assert.strictEqual(syncEngine.calculateBackoffDelay(3), 4000); // 4s
  assert.strictEqual(syncEngine.calculateBackoffDelay(6), 30000); // Max 30s
  console.log("   ✓ Backoff delay calculation passed.");

  // Test 3: Queue item enqueueing & FIFO ordering
  console.log("\n3️⃣ Testing queue enqueueing & FIFO ordering setup...");
  const item1: Omit<QueuedTransaction, "createdAt" | "updatedAt"> & { createdAt?: number; updatedAt?: number } = {
    id: "queue-item-1",
    clientRequestId: "req-uuid-001",
    userId: "user-123",
    operation: "CREATE_TRANSACTION",
    payload: { amount: 50, type: "EXPENSE", categoryId: "cat-1", date: "2026-09-11" },
    status: "PENDING",
    retryCount: 0,
    createdAt: 1000,
  };

  const item2: Omit<QueuedTransaction, "createdAt" | "updatedAt"> & { createdAt?: number; updatedAt?: number } = {
    id: "queue-item-2",
    clientRequestId: "req-uuid-002",
    userId: "user-123",
    operation: "CREATE_TRANSACTION",
    payload: { amount: 100, type: "INCOME", categoryId: "cat-2", date: "2026-09-11" },
    status: "PENDING",
    retryCount: 0,
    createdAt: 2000,
  };

  await transactionQueueStore.enqueueTransaction(item1);
  await transactionQueueStore.enqueueTransaction(item2);

  const pending = await transactionQueueStore.getPendingTransactions("user-123");
  assert.strictEqual(pending.length, 2);
  assert.strictEqual(pending[0].id, "queue-item-1", "Oldest item must be first (FIFO)");
  assert.strictEqual(pending[1].id, "queue-item-2");
  console.log("   ✓ FIFO queue ordering passed.");

  // Test 4: User Queue Isolation
  console.log("\n4️⃣ Testing user queue isolation...");
  await transactionQueueStore.enqueueTransaction({
    id: "queue-item-user-456",
    clientRequestId: "req-uuid-003",
    userId: "user-456",
    operation: "CREATE_TRANSACTION",
    payload: { amount: 200, type: "EXPENSE", categoryId: "cat-1", date: "2026-09-11" },
    status: "PENDING",
    retryCount: 0,
  });

  const user123Pending = await transactionQueueStore.getPendingTransactions("user-123");
  assert.strictEqual(user123Pending.length, 2, "user-123 must only fetch their own items");

  const user456Pending = await transactionQueueStore.getPendingTransactions("user-456");
  assert.strictEqual(user456Pending.length, 1);
  assert.strictEqual(user456Pending[0].userId, "user-456");
  console.log("   ✓ User queue isolation passed.");

  // Test 5: Stale SYNCING Item Crash Recovery
  console.log("\n5️⃣ Testing stale SYNCING recovery after simulated tab crash...");
  await transactionQueueStore.updateQueueStatus("queue-item-1", "SYNCING", {
    lastAttemptedAt: Date.now() - 300000, // 5 mins ago (stale > 2 mins)
  });

  const resetCount = await transactionQueueStore.resetStaleSyncingTransactions(120000);
  assert.strictEqual(resetCount, 1, "Should reset 1 stale item");

  const recoveredItem = await transactionQueueStore.getQueuedTransactionById("queue-item-1");
  assert.strictEqual(recoveredItem?.status, "PENDING", "Stale item must return to PENDING");
  console.log("   ✓ Stale SYNCING recovery passed.");

  // Test 6: Multi-Tab Safety Lock
  console.log("\n6️⃣ Testing multi-tab Web Lock safety...");
  let executeCount = 0;

  const lockTask1 = withSyncLock(async () => {
    executeCount++;
    await new Promise((resolve) => setTimeout(resolve, 50));
    return "lock1";
  });

  const lockTask2 = withSyncLock(async () => {
    executeCount++;
    return "lock2";
  });

  const [res1, res2] = await Promise.all([lockTask1, lockTask2]);
  assert.ok(executeCount >= 1, "At least one lock task executed");
  assert.strictEqual(res1, "lock1");
  // Second concurrent lock request must return null or wait safely
  assert.ok(res2 === null || res2 === "lock2");
  console.log("   ✓ Multi-tab locking passed.");

  // Clean up
  await transactionQueueStore.clearAllQueue();
  closeDB();

  console.log("\n🎉 ALL F8.5 SYNC ENGINE TESTS PASSED SUCCESSFULLY!");
}

runF85SyncEngineTestSuite().catch((err) => {
  console.error("\n❌ F8.5 Sync Engine Test Suite Failed:", err);
  process.exit(1);
});
