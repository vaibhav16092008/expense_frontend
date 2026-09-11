/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-asserted-optional-chain */
/**
 * Comprehensive Automated Test Suite for ExpenseIQ IndexedDB Storage (Phase F8.3)
 */

import indexedDB, { IDBKeyRange } from 'fake-indexeddb';

// Polyfill browser globals for Node.js test execution environment
(globalThis as any).window = globalThis;
(globalThis as any).indexedDB = indexedDB;
(globalThis as any).IDBKeyRange = IDBKeyRange;

import assert from 'node:assert';
import {
  isIndexedDBSupported,
  getDB,
  closeDB,
  transactionQueueStore,
  TRANSACTION_QUEUE_STORE,
  QueuedTransaction,
} from '../src/lib/offline';


async function runIndexedDBTestSuite() {
  console.log('🧪 Starting ExpenseIQ Phase F8.3 IndexedDB Storage Test Suite...\n');

  // 1. SSR / Capability check
  console.log('1️⃣ Testing browser capability check...');
  assert.strictEqual(isIndexedDBSupported(), true, 'IndexedDB should be supported with fake-indexeddb polyfill');
  console.log('   ✓ Browser capability check passed.');

  // 2. Database initialization and store verification
  console.log('\n2️⃣ Testing database initialization and store setup...');
  const db = await getDB();
  assert.ok(db, 'Database connection instance should be defined');
  assert.strictEqual(db.name, 'ExpenseIQ_Offline_DB', 'Database name must be ExpenseIQ_Offline_DB');
  assert.strictEqual(db.version, 1, 'Database version must be 1');
  assert.ok(
    db.objectStoreNames.contains(TRANSACTION_QUEUE_STORE),
    `Object store ${TRANSACTION_QUEUE_STORE} must exist`
  );
  console.log('   ✓ Database name, version, and object store availability verified.');

  // Clean state
  await transactionQueueStore.clearAllQueue();

  // 3. Insert / Enqueue transaction
  console.log('\n3️⃣ Testing transaction enqueue (Insert)...');
  const mockItem: Omit<QueuedTransaction, 'createdAt' | 'updatedAt'> = {
    id: 'queue-uuid-001',
    clientRequestId: 'client-req-uuid-101',
    userId: 'user-id-abc',
    operation: 'CREATE_TRANSACTION',
    payload: {
      amount: 150.75,
      type: 'EXPENSE',
      categoryId: 'cat-groceries',
      description: 'Grocery shopping offline',
      date: '2026-09-11',
      merchant: 'Supermarket',
    },
    status: 'PENDING',
    retryCount: 0,
  };

  const inserted = await transactionQueueStore.enqueueTransaction(mockItem);
  assert.strictEqual(inserted.id, 'queue-uuid-001');
  assert.strictEqual(inserted.clientRequestId, 'client-req-uuid-101');
  assert.strictEqual(inserted.status, 'PENDING');
  assert.ok(inserted.createdAt > 0, 'createdAt timestamp should be set');
  console.log('   ✓ Enqueue transaction passed.');

  // 4. Read by ID
  console.log('\n4️⃣ Testing read by ID...');
  const fetched = await transactionQueueStore.getQueuedTransactionById('queue-uuid-001');
  assert.ok(fetched, 'Queued item should exist');
  assert.strictEqual(fetched?.payload.amount, 150.75);
  assert.strictEqual(fetched?.userId, 'user-id-abc');
  console.log('   ✓ Read by ID passed.');

  // 5. Index-based lookup by clientRequestId
  console.log('\n5️⃣ Testing index lookup by clientRequestId...');
  const byClientReqId = await transactionQueueStore.getQueuedTransactionByClientRequestId('client-req-uuid-101');
  assert.ok(byClientReqId, 'Lookup by clientRequestId index should find item');
  assert.strictEqual(byClientReqId?.id, 'queue-uuid-001');
  console.log('   ✓ Index-based lookup passed.');

  // 6. Update Status
  console.log('\n6️⃣ Testing status update (PENDING -> SYNCING)...');
  const syncingItem = await transactionQueueStore.updateQueueStatus('queue-uuid-001', 'SYNCING');
  assert.strictEqual(syncingItem?.status, 'SYNCING');

  const reRead = await transactionQueueStore.getQueuedTransactionById('queue-uuid-001');
  assert.strictEqual(reRead?.status, 'SYNCING');
  console.log('   ✓ Status update passed.');

  // 7. Increment Retry Count & Record Failure Details
  console.log('\n7️⃣ Testing increment retry count & error details...');
  const failedItem = await transactionQueueStore.incrementRetryCount(
    'queue-uuid-001',
    'Network request failed',
    'ERR_NETWORK'
  );
  assert.strictEqual(failedItem?.status, 'FAILED');
  assert.strictEqual(failedItem?.retryCount, 1);
  assert.strictEqual(failedItem?.errorMessage, 'Network request failed');
  assert.strictEqual(failedItem?.errorCode, 'ERR_NETWORK');
  assert.ok(failedItem?.lastAttemptedAt! > 0);
  console.log('   ✓ Retry increment & error logging passed.');

  // 8. Add second item and query list
  console.log('\n8️⃣ Testing list/query pending transactions...');
  await transactionQueueStore.enqueueTransaction({
    id: 'queue-uuid-002',
    clientRequestId: 'client-req-uuid-102',
    userId: 'user-id-abc',
    operation: 'CREATE_TRANSACTION',
    payload: {
      amount: 45.0,
      type: 'EXPENSE',
      categoryId: 'cat-transport',
      date: '2026-09-11',
    },
    status: 'PENDING',
    retryCount: 0,
  });

  const pendingList = await transactionQueueStore.getPendingTransactions('user-id-abc');
  assert.strictEqual(pendingList.length, 1);
  assert.strictEqual(pendingList[0].id, 'queue-uuid-002');

  const allList = await transactionQueueStore.getAllQueuedTransactions('user-id-abc');
  assert.strictEqual(allList.length, 2, 'Total records for user should equal 2');
  console.log('   ✓ List & query passed.');

  // 9. Reopening Database Persistence
  console.log('\n9️⃣ Testing persistence across closing & reopening database...');
  closeDB();
  const reopenedDb = await getDB();
  assert.ok(reopenedDb, 'Reopened database instance should exist');

  const persistedItem = await transactionQueueStore.getQueuedTransactionById('queue-uuid-002');
  assert.ok(persistedItem, 'Data must survive database close and reopen');
  assert.strictEqual(persistedItem?.clientRequestId, 'client-req-uuid-102');
  console.log('   ✓ Database reopening persistence passed.');

  // 10. User Queue Isolation & Clear User Queue
  console.log('\n🔟 Testing user queue isolation & user clear...');
  await transactionQueueStore.enqueueTransaction({
    id: 'queue-uuid-003',
    clientRequestId: 'client-req-uuid-103',
    userId: 'different-user-xyz',
    operation: 'CREATE_TRANSACTION',
    payload: { amount: 10, type: 'INCOME', categoryId: 'cat-salary', date: '2026-09-11' },
    status: 'PENDING',
    retryCount: 0,
  });

  const userAbcItems = await transactionQueueStore.getAllQueuedTransactions('user-id-abc');
  assert.strictEqual(userAbcItems.length, 2);

  const userXyzItems = await transactionQueueStore.getAllQueuedTransactions('different-user-xyz');
  assert.strictEqual(userXyzItems.length, 1);

  const deletedCount = await transactionQueueStore.clearUserQueue('user-id-abc');
  assert.strictEqual(deletedCount, 2, 'Should clear 2 items for user-id-abc');

  const remainingXyz = await transactionQueueStore.getAllQueuedTransactions('different-user-xyz');
  assert.strictEqual(remainingXyz.length, 1, 'different-user-xyz items must remain untouched');
  console.log('   ✓ User queue isolation passed.');

  // 11. Delete single item & Missing records check
  console.log('\n1️⃣1️⃣ Testing single record deletion and missing record fallback...');
  const deleted = await transactionQueueStore.removeQueuedTransaction('queue-uuid-003');
  assert.strictEqual(deleted, true);

  const missingRecord = await transactionQueueStore.getQueuedTransactionById('queue-uuid-003');
  assert.strictEqual(missingRecord, null, 'Deleted item must return null');
  console.log('   ✓ Single deletion and missing record handling passed.');

  // Clean up
  await transactionQueueStore.clearAllQueue();

  console.log('\n🎉 ALL F8.3 INDEXEDDB STORAGE TESTS PASSED SUCCESSFULLY!');
}

runIndexedDBTestSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
