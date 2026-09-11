"use client";

import React, { useState } from "react";
import { RotateCw, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { transactionQueueStore, QueuedTransaction } from "@/lib/offline";
import { syncEngine } from "@/lib/offline/syncEngine";
import { notifyQueueChanged } from "@/hooks/useOfflineQueueStatus";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";

interface FailedTransactionActionsProps {
  item: QueuedTransaction;
}

export function FailedTransactionActions({ item }: FailedTransactionActionsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      // Reset status to PENDING using the EXACT SAME clientRequestId!
      await transactionQueueStore.updateQueueStatus(item.id, "PENDING", {
        errorMessage: undefined,
        errorCode: undefined,
      });
      notifyQueueChanged();

      toast({
        type: "info",
        title: "Retrying sync",
        description: "Attempting to sync transaction...",
      });

      if (user?.id) {
        await syncEngine.syncUserQueue(user.id, queryClient);
        notifyQueueChanged();
      }
    } catch {
      toast({
        type: "error",
        title: "Retry Error",
        description: "Failed to reset item for retry.",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDiscard = async () => {
    if (!confirm("Are you sure you want to discard this unsynced transaction?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await transactionQueueStore.removeQueuedTransaction(item.id);
      notifyQueueChanged();
      toast({
        type: "info",
        title: "Transaction discarded",
        description: "Unsynced local record was removed.",
      });
    } catch {
      toast({
        type: "error",
        title: "Error",
        description: "Failed to remove transaction.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRetry}
        disabled={isRetrying || isDeleting}
        aria-label="Retry syncing transaction"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-[var(--radius-md)] border border-rose-500/30 transition-colors focus:outline-none focus:ring-1 focus:ring-rose-500"
      >
        <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
        <span>Retry</span>
      </button>

      <button
        onClick={handleDiscard}
        disabled={isRetrying || isDeleting}
        aria-label="Discard unsynced transaction"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-[var(--surface-secondary)] rounded-[var(--radius-md)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Discard</span>
      </button>
    </div>
  );
}
