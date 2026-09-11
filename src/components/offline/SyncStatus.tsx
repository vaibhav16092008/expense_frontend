"use client";

import React, { useState } from "react";
import { CloudOff, RefreshCw, AlertTriangle, RotateCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useOfflineQueueStatus } from "@/hooks/useOfflineQueueStatus";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useAuth } from "@/providers/AuthProvider";
import { syncEngine } from "@/lib/offline/syncEngine";
import { useToast } from "@/providers/ToastProvider";

/**
 * Compact header sync status indicator with manual sync trigger
 */
export function SyncStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();
  const { pendingCount, syncingCount, failedCount, totalCount, isSyncing, refetchQueue } =
    useOfflineQueueStatus();
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  if (totalCount === 0) {
    return null;
  }

  const handleSyncNow = async () => {
    if (!isOnline) {
      toast({
        type: "info",
        title: "You're offline",
        description: "Sync will resume automatically when you're back online.",
      });
      return;
    }

    if (!user?.id) return;

    try {
      setIsManualSyncing(true);
      const res = await syncEngine.syncUserQueue(user.id, queryClient);
      await refetchQueue();

      if (res && res.succeeded > 0) {
        toast({
          type: "success",
          title: "Sync completed",
          description: `${res.succeeded} transaction${res.succeeded > 1 ? "s" : ""} synced successfully.`,
        });
      } else if (res && res.failed > 0) {
        toast({
          type: "warning",
          title: "Sync completed with issues",
          description: `${res.failed} transaction${res.failed > 1 ? "s" : ""} failed to sync.`,
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Sync Error",
        description: "Failed to trigger sync. Please try again.",
      });
    } finally {
      setIsManualSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status Badge */}
      <div
        role="status"
        aria-label={`Offline sync status: ${totalCount} queued transactions`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all"
      >
        {isSyncing || syncingCount > 0 || isManualSyncing ? (
          <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            <span>Syncing…</span>
          </span>
        ) : failedCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{failedCount} failed</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20">
            <CloudOff className="w-3.5 h-3.5 text-amber-500" />
            <span>{pendingCount} waiting to sync</span>
          </span>
        )}
      </div>

      {/* Sync Now Action */}
      {isOnline && pendingCount > 0 && !isSyncing && !isManualSyncing && (
        <button
          onClick={handleSyncNow}
          disabled={isManualSyncing}
          aria-label="Sync transactions now"
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-muted)] rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        >
          <RotateCw className="w-3 h-3" />
          <span>Sync now</span>
        </button>
      )}
    </div>
  );
}
