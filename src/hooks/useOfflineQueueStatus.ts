"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  transactionQueueStore,
  QueuedTransaction,
  subscribeBroadcastChannel,
  publishBroadcastEvent,
} from "@/lib/offline";

export interface OfflineQueueStatus {
  pendingCount: number;
  syncingCount: number;
  failedCount: number;
  totalCount: number;
  hasPending: boolean;
  hasFailed: boolean;
  isSyncing: boolean;
  queuedItems: QueuedTransaction[];
  refetchQueue: () => Promise<void>;
}

/**
 * SSR-safe, user-isolated hook for reading the offline transaction queue state
 */
export function useOfflineQueueStatus(): OfflineQueueStatus {
  const { user, isAuthenticated } = useAuth();
  const [queuedItems, setQueuedItems] = useState<QueuedTransaction[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const userId = isAuthenticated && user?.id ? user.id : undefined;

  const refetchQueue = useCallback(async () => {
    if (!userId || typeof window === "undefined") {
      setQueuedItems([]);
      return;
    }

    try {
      setIsFetching(true);
      const items = await transactionQueueStore.getAllQueuedTransactions(userId);
      setQueuedItems(items);
    } catch (err) {
      console.warn("[ExpenseIQ OfflineUX] Failed to read queue status:", err);
      setQueuedItems([]);
    } finally {
      setIsFetching(false);
    }
  }, [userId]);

  useEffect(() => {
    if (typeof window === "undefined" || !userId) {
      return;
    }

    // Schedule initial queue fetch on microtask to avoid sync setState in effect setup
    void Promise.resolve().then(() => {
      refetchQueue();
    });

    // Listen to local window events triggered by queue changes
    const handleQueueChange = () => {
      void Promise.resolve().then(() => {
        refetchQueue();
      });
    };

    window.addEventListener("expenseiq:queue_changed", handleQueueChange);
    window.addEventListener("online", handleQueueChange);
    window.addEventListener("offline", handleQueueChange);

    // Subscribe to cross-tab BroadcastChannel events (No re-broadcast loop)
    const unsubscribeBroadcast = subscribeBroadcastChannel((msg) => {
      if (msg.type === "QUEUE_CHANGED" || msg.type === "SYNC_COMPLETED") {
        void Promise.resolve().then(() => {
          refetchQueue();
        });
      }
    });

    return () => {
      window.removeEventListener("expenseiq:queue_changed", handleQueueChange);
      window.removeEventListener("online", handleQueueChange);
      window.removeEventListener("offline", handleQueueChange);
      unsubscribeBroadcast();
    };
  }, [userId, refetchQueue]);

  const activeItems = userId ? queuedItems : [];
  const pendingCount = activeItems.filter((i) => i.status === "PENDING").length;
  const syncingCount = activeItems.filter((i) => i.status === "SYNCING").length;
  const failedCount = activeItems.filter((i) => i.status === "FAILED").length;
  const totalCount = activeItems.length;

  return {
    pendingCount,
    syncingCount,
    failedCount,
    totalCount,
    hasPending: pendingCount > 0,
    hasFailed: failedCount > 0,
    isSyncing: syncingCount > 0 || isFetching,
    queuedItems: activeItems,
    refetchQueue,
  };
}

/**
 * Global helper event dispatcher to notify UI when queue state changes.
 * Dispatches local window event and broadcasts across open tabs safely.
 */
export function notifyQueueChanged(broadcast: boolean = true): void {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof Event !== "undefined") {
    window.dispatchEvent(new Event("expenseiq:queue_changed"));
  }

  if (broadcast) {
    publishBroadcastEvent({ type: "QUEUE_CHANGED" });
  }
}
