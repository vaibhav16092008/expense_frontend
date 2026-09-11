/**
 * ExpenseIQ Transaction Queue Repository Store
 * High-level typed CRUD operations for offline transaction persistence.
 */

import {
  TRANSACTION_QUEUE_STORE,
  isIndexedDBSupported,
  withStore,
} from './db';
import {
  QueuedTransaction,
  QueueItemStatus,
} from './types';

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB request error'));
  });
}

export class TransactionQueueStore {
  /**
   * Enqueue a new transaction for offline sync
   */
  public async enqueueTransaction(
    item: Omit<QueuedTransaction, 'createdAt' | 'updatedAt'> & {
      createdAt?: number;
      updatedAt?: number;
    }
  ): Promise<QueuedTransaction> {
    if (!isIndexedDBSupported()) {
      throw new Error('[QueueStore] IndexedDB is not supported');
    }

    const now = Date.now();
    const record: QueuedTransaction = {
      ...item,
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    };

    await withStore(TRANSACTION_QUEUE_STORE, 'readwrite', async (store) => {
      const request = store.add(record);
      await promisifyRequest(request);
    });

    return record;
  }

  /**
   * Fetch a single queued transaction by its local queue ID
   */
  public async getQueuedTransactionById(id: string): Promise<QueuedTransaction | null> {
    if (!isIndexedDBSupported()) return null;

    return withStore(TRANSACTION_QUEUE_STORE, 'readonly', async (store) => {
      const request = store.get(id);
      const result = await promisifyRequest(request);
      return (result as QueuedTransaction) || null;
    });
  }

  /**
   * Fetch a queued transaction by its backend idempotency clientRequestId
   */
  public async getQueuedTransactionByClientRequestId(
    clientRequestId: string
  ): Promise<QueuedTransaction | null> {
    if (!isIndexedDBSupported()) return null;

    return withStore(TRANSACTION_QUEUE_STORE, 'readonly', async (store) => {
      const index = store.index('by_clientRequestId');
      const request = index.get(clientRequestId);
      const result = await promisifyRequest(request);
      return (result as QueuedTransaction) || null;
    });
  }

  /**
   * Get all pending transactions (PENDING status), ordered by createdAt
   */
  public async getPendingTransactions(userId?: string): Promise<QueuedTransaction[]> {
    if (!isIndexedDBSupported()) return [];

    return withStore(TRANSACTION_QUEUE_STORE, 'readonly', async (store) => {
      const index = store.index('by_status');
      const request = index.getAll('PENDING');
      const items = (await promisifyRequest(request)) as QueuedTransaction[];

      const filtered = userId ? items.filter((item) => item.userId === userId) : items;
      return filtered.sort((a, b) => a.createdAt - b.createdAt);
    });
  }

  /**
   * Get all queued transactions regardless of status
   */
  public async getAllQueuedTransactions(userId?: string): Promise<QueuedTransaction[]> {
    if (!isIndexedDBSupported()) return [];

    return withStore(TRANSACTION_QUEUE_STORE, 'readonly', async (store) => {
      const request = store.getAll();
      const items = (await promisifyRequest(request)) as QueuedTransaction[];

      const filtered = userId ? items.filter((item) => item.userId === userId) : items;
      return filtered.sort((a, b) => a.createdAt - b.createdAt);
    });
  }

  /**
   * Update queue item status and optional fields
   */
  public async updateQueueStatus(
    id: string,
    status: QueueItemStatus,
    updates?: Partial<Omit<QueuedTransaction, 'id' | 'clientRequestId' | 'createdAt'>>
  ): Promise<QueuedTransaction | null> {
    if (!isIndexedDBSupported()) return null;

    return withStore(TRANSACTION_QUEUE_STORE, 'readwrite', async (store) => {
      const getRequest = store.get(id);
      const existing = (await promisifyRequest(getRequest)) as QueuedTransaction | undefined;

      if (!existing) return null;

      const updatedRecord: QueuedTransaction = {
        ...existing,
        ...updates,
        status,
        updatedAt: Date.now(),
      };

      const putRequest = store.put(updatedRecord);
      await promisifyRequest(putRequest);

      return updatedRecord;
    });
  }

  /**
   * Increment retry count and set failure details
   */
  public async incrementRetryCount(
    id: string,
    errorMessage?: string,
    errorCode?: string
  ): Promise<QueuedTransaction | null> {
    if (!isIndexedDBSupported()) return null;

    return withStore(TRANSACTION_QUEUE_STORE, 'readwrite', async (store) => {
      const getRequest = store.get(id);
      const existing = (await promisifyRequest(getRequest)) as QueuedTransaction | undefined;

      if (!existing) return null;

      const now = Date.now();
      const updatedRecord: QueuedTransaction = {
        ...existing,
        status: 'FAILED',
        retryCount: existing.retryCount + 1,
        lastAttemptedAt: now,
        errorMessage: errorMessage || existing.errorMessage,
        errorCode: errorCode || existing.errorCode,
        updatedAt: now,
      };

      const putRequest = store.put(updatedRecord);
      await promisifyRequest(putRequest);

      return updatedRecord;
    });
  }

  /**
   * Remove a single record from the offline queue by ID
   */
  public async removeQueuedTransaction(id: string): Promise<boolean> {
    if (!isIndexedDBSupported()) return false;

    return withStore(TRANSACTION_QUEUE_STORE, 'readwrite', async (store) => {
      const request = store.delete(id);
      await promisifyRequest(request);
      return true;
    });
  }

  /**
   * Clear all queue records for a specific user ID (e.g. upon user logout)
   */
  public async clearUserQueue(userId: string): Promise<number> {
    if (!isIndexedDBSupported() || !userId) return 0;

    return withStore(TRANSACTION_QUEUE_STORE, 'readwrite', async (store) => {
      const index = store.index('by_userId');
      const request = index.getAllKeys(userId);
      const keys = await promisifyRequest(request);

      for (const key of keys) {
        store.delete(key);
      }

      return keys.length;
    });
  }

  /**
   * Clear entire transaction queue store
   */
  public async clearAllQueue(): Promise<void> {
    if (!isIndexedDBSupported()) return;

    return withStore(TRANSACTION_QUEUE_STORE, 'readwrite', async (store) => {
      const request = store.clear();
      await promisifyRequest(request);
    });
  }
}

// Export singleton instance
export const transactionQueueStore = new TransactionQueueStore();
