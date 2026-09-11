/**
 * ExpenseIQ Multi-Tab Sync Locking Abstraction
 * Uses browser-native Web Locks API (navigator.locks) to prevent multi-tab concurrent sync.
 */

const SYNC_LOCK_NAME = "expenseiq_sync_engine_lock";
let inMemoryLock = false;

/**
 * Executes a callback within a cross-tab exclusive lock.
 * Prevents multiple browser tabs from processing the transaction queue simultaneously.
 */
export async function withSyncLock<T>(callback: () => Promise<T>): Promise<T | null> {
  // 1. Browser-native Web Locks API (Preferred for multi-tab safety)
  if (typeof navigator !== "undefined" && "locks" in navigator && navigator.locks) {
    try {
      return await navigator.locks.request(
        SYNC_LOCK_NAME,
        { mode: "exclusive", ifAvailable: true },
        async (lock) => {
          if (!lock) {
            // Another tab is actively holding the sync lock
            return null;
          }
          return await callback();
        }
      );
    } catch (err) {
      console.warn("[ExpenseIQ SyncLock] Web Locks API error, falling back:", err);
    }
  }

  // 2. In-memory single-tab fallback if Web Locks API is unavailable
  if (inMemoryLock) {
    return null;
  }

  try {
    inMemoryLock = true;
    return await callback();
  } finally {
    inMemoryLock = false;
  }
}
