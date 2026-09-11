"use client";

import React from "react";
import { CloudOff, RefreshCw, AlertTriangle } from "lucide-react";
import { useOfflineQueueStatus } from "@/hooks/useOfflineQueueStatus";
import { FailedTransactionActions } from "./FailedTransactionActions";
import { Category } from "@/features/categories/types";

interface OfflineTransactionsListProps {
  categories?: Category[];
}

export function OfflineTransactionsList({ categories = [] }: OfflineTransactionsListProps) {
  const { queuedItems, totalCount } = useOfflineQueueStatus();
  const [now] = React.useState(() => Date.now());

  if (totalCount === 0) {
    return null;
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="bg-[var(--surface)] border border-amber-500/30 rounded-[var(--radius-lg)] p-4 sm:p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <CloudOff className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Offline Transactions</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Transactions saved locally waiting to sync with the server.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
          {totalCount} item{totalCount > 1 ? "s" : ""}
        </span>
      </div>

      {/* Item List */}
      <div className="divide-y divide-[var(--border-subtle)]">
        {queuedItems.map((item) => {
          const payload = item.payload;
            const categoryName = categoryMap.get(payload.categoryId) || "Uncategorized";
            const formattedAmount = `${payload.type === "EXPENSE" ? "-" : "+"}$${Number(payload.amount).toFixed(2)}`;
            const timeAgo = Math.max(1, Math.round((now - item.createdAt) / 60000));

            return (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
            >
              {/* Item Info */}
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    payload.type === "EXPENSE"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {payload.type === "EXPENSE" ? "EXP" : "INC"}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {categoryName}
                    </span>
                    {payload.merchant && (
                      <span className="text-xs text-[var(--text-muted)] truncate">
                        • {payload.merchant}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
                    <span>{payload.date}</span>
                    <span>•</span>
                    <span>Saved {timeAgo} min ago</span>
                    {typeof payload.description === "string" && payload.description && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">{payload.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                  {formattedAmount}
                </span>

                {/* Status Badges */}
                {item.status === "PENDING" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    <CloudOff className="w-3 h-3 text-amber-500" />
                    Pending sync
                  </span>
                )}

                {item.status === "SYNCING" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                    Syncing…
                  </span>
                )}

                {item.status === "FAILED" && (
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      Sync failed
                    </span>
                    <FailedTransactionActions item={item} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
