/**
 * ExpenseIQ Production-Grade Native IndexedDB Connection Manager
 * Versioned database setup with SSR safety and typed transaction helpers.
 */

export const DB_NAME = 'ExpenseIQ_Offline_DB';
export const DB_VERSION = 1;
export const TRANSACTION_QUEUE_STORE = 'transaction_queue';

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * SSR capability check to ensure IndexedDB is accessed ONLY in browser context
 */
export function isIndexedDBSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.indexedDB !== 'undefined' &&
    window.indexedDB !== null
  );
}

/**
 * Open or retrieve singleton connection to ExpenseIQ IndexedDB database
 */
export function getDB(): Promise<IDBDatabase> {
  if (!isIndexedDBSupported()) {
    return Promise.reject(
      new Error('[ExpenseIQ DB] IndexedDB is not supported or running in SSR context.')
    );
  }

  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        // Create transaction_queue object store if it doesn't exist
        if (!db.objectStoreNames.contains(TRANSACTION_QUEUE_STORE)) {
          const store = db.createObjectStore(TRANSACTION_QUEUE_STORE, {
            keyPath: 'id',
          });

          // Indexes for efficient querying
          store.createIndex('by_status', 'status', { unique: false });
          store.createIndex('by_clientRequestId', 'clientRequestId', { unique: true });
          store.createIndex('by_userId', 'userId', { unique: false });
          store.createIndex('by_createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        dbInstance = request.result;

        // Connection loss / versionchange listener
        dbInstance.onversionchange = () => {
          if (dbInstance) {
            dbInstance.close();
            dbInstance = null;
            dbPromise = null;
          }
        };

        dbInstance.onerror = (event) => {
          console.error('[ExpenseIQ DB] Uncaught database error:', event);
        };

        resolve(dbInstance);
      };

      request.onerror = () => {
        dbPromise = null;
        reject(request.error || new Error('[ExpenseIQ DB] Failed to open database'));
      };
    } catch (err) {
      dbPromise = null;
      reject(err);
    }
  });

  return dbPromise;
}

/**
 * Close database connection instance (primarily for testing and reset)
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    dbPromise = null;
  }
}

/**
 * Execute a typed transaction-safe operation against an object store
 */
export async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore, transaction: IDBTransaction) => Promise<T> | T
): Promise<T> {
  const db = await getDB();

  return new Promise<T>((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      let callbackResult: Promise<T> | T;
      try {
        callbackResult = callback(store, tx);
      } catch (err) {
        tx.abort();
        return reject(err);
      }

      tx.onerror = () => {
        reject(tx.error || new Error('[ExpenseIQ DB] Transaction failed'));
      };

      tx.onabort = () => {
        reject(tx.error || new Error('[ExpenseIQ DB] Transaction aborted'));
      };

      if (callbackResult instanceof Promise) {
        callbackResult.then(resolve).catch((err) => {
          try {
            tx.abort();
          } catch {
            // Ignore if already completed or aborted
          }
          reject(err);
        });
      } else {
        tx.oncomplete = () => {
          resolve(callbackResult);
        };
      }
    } catch (err) {
      reject(err);
    }
  });
}
