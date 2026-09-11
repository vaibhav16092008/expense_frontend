/**
 * ExpenseIQ Offline Transaction Sync Engine
 * Event-driven, idempotent, sequential queue execution with Web Locks API safety.
 */

import { QueryClient } from "@tanstack/react-query";
import { normalizeApiError } from "@/lib/api/errors";
import { createTransaction } from "@/features/transactions/api";
import { CreateTransactionPayload } from "@/features/transactions/types";
import { transactionQueueStore } from "./transactionQueueStore";
import { withSyncLock } from "./syncLock";

export interface SyncEngineOptions {
  staleTimeoutMs?: number;
  maxRetries?: number;
  baseBackoffMs?: number;
  maxBackoffMs?: number;
}

export interface SyncResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
}

export class SyncEngine {
  private staleTimeoutMs: number;
  private maxRetries: number;
  private baseBackoffMs: number;
  private maxBackoffMs: number;
  private isRunning: boolean = false;

  constructor(options: SyncEngineOptions = {}) {
    this.staleTimeoutMs = options.staleTimeoutMs || 120000; // 2 minutes stale timeout
    this.maxRetries = options.maxRetries || 5;
    this.baseBackoffMs = options.baseBackoffMs || 1000; // 1s initial backoff
    this.maxBackoffMs = options.maxBackoffMs || 30000; // 30s max backoff
  }

  /**
   * Calculate exponential backoff delay for retry attempts
   */
  public calculateBackoffDelay(retryCount: number): number {
    if (retryCount <= 0) return 0;
    const delay = this.baseBackoffMs * Math.pow(2, retryCount - 1);
    return Math.min(delay, this.maxBackoffMs);
  }

  /**
   * Trigger a safe, locked sync run for the specified user
   */
  public async syncUserQueue(
    userId: string,
    queryClient?: QueryClient
  ): Promise<SyncResult | null> {
    if (!userId || userId === "anonymous") {
      return null;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return null;
    }

    // Acquire cross-tab Web Lock to prevent concurrent tab processing
    return withSyncLock(async () => {
      return this.executeSync(userId, queryClient);
    });
  }

  /**
   * Internal sequential queue execution
   */
  private async executeSync(
    userId: string,
    queryClient?: QueryClient
  ): Promise<SyncResult> {
    if (this.isRunning) {
      return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
    }

    this.isRunning = true;
    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let processed = 0;
    let hasSyncedAny = false;

    try {
      // 1. Recover stale SYNCING items if tab crashed midway
      await transactionQueueStore.resetStaleSyncingTransactions(this.staleTimeoutMs);

      // 2. Fetch PENDING queue items ordered by createdAt ASC (FIFO)
      const pendingItems = await transactionQueueStore.getPendingTransactions(userId);

      if (pendingItems.length === 0) {
        return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
      }

      // 3. Process items sequentially
      for (const item of pendingItems) {
        // Stop if network drops midway
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          break;
        }

        // Bounded backoff check
        const now = Date.now();
        const backoffDelay = this.calculateBackoffDelay(item.retryCount);
        if (item.lastAttemptedAt && now - item.lastAttemptedAt < backoffDelay) {
          skipped++;
          continue;
        }

        // Max retries exceeded check
        if (item.retryCount >= this.maxRetries) {
          await transactionQueueStore.updateQueueStatus(item.id, "FAILED", {
            errorMessage: `Max retries (${this.maxRetries}) exceeded`,
            errorCode: "ERR_MAX_RETRIES",
          });
          failed++;
          continue;
        }

        processed++;

        // 4. Mark item status as SYNCING before making HTTP request
        await transactionQueueStore.updateQueueStatus(item.id, "SYNCING", {
          lastAttemptedAt: now,
        });

        // Construct payload ensuring identical clientRequestId
        const payload: CreateTransactionPayload = {
          ...(item.payload as CreateTransactionPayload),
          clientRequestId: item.clientRequestId,
        };

        try {
          // 5. Send transaction payload with SAME clientRequestId to backend
          await createTransaction(payload);

          // SUCCESS (201 Created or 200 Idempotent Replay): Remove item from queue
          await transactionQueueStore.removeQueuedTransaction(item.id);
          succeeded++;
          hasSyncedAny = true;
        } catch (rawError) {
          const error = normalizeApiError(rawError);

          // Network Failure (Transient network loss)
          if (error.isNetworkError) {
            await transactionQueueStore.updateQueueStatus(item.id, "PENDING", {
              errorMessage: error.message,
              errorCode: "ERR_NETWORK",
            });
            // Stop loop when network drops
            break;
          }

          // Rate limit (429) or Server error (5xx) -> Backoff & Retry later
          if (error.statusCode === 429 || error.statusCode >= 500) {
            await transactionQueueStore.incrementRetryCount(
              item.id,
              error.message,
              String(error.statusCode)
            );
            // Return to PENDING for backoff retry
            await transactionQueueStore.updateQueueStatus(item.id, "PENDING");
            break;
          }

          // Permanent Failure (400 Bad Request, 403 Forbidden, 404 Not Found)
          if (error.statusCode >= 400 && error.statusCode < 500) {
            await transactionQueueStore.incrementRetryCount(
              item.id,
              error.message,
              String(error.statusCode)
            );
            // Increment retry count sets status to FAILED
            failed++;
          } else {
            // Default fallback for unknown errors
            await transactionQueueStore.incrementRetryCount(
              item.id,
              error.message,
              "ERR_UNKNOWN"
            );
            failed++;
          }
        }
      }

      // 6. Invalidate TanStack Query server state if any items were successfully synchronized
      if (hasSyncedAny && queryClient) {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    } finally {
      this.isRunning = false;
    }

    return { processed, succeeded, failed, skipped };
  }
}

// Export singleton instance
export const syncEngine = new SyncEngine();
