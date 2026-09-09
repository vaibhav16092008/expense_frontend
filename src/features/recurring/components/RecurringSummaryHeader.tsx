"use client";

import React from "react";
import { RecurringTransaction } from "../types";
import { Calendar, CheckCircle2, PauseCircle, Clock } from "lucide-react";

export interface RecurringSummaryHeaderProps {
  transactions: RecurringTransaction[];
  totalCount?: number;
  isFiltered?: boolean;
}

export function RecurringSummaryHeader({
  transactions,
  totalCount,
  isFiltered = false,
}: RecurringSummaryHeaderProps) {
  const activeCount = transactions.filter((t) => t.active).length;
  const pausedCount = transactions.filter((t) => !t.active).length;

  // Upcoming in next 7 days among active schedules
  const now = new Date();
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcoming7DaysCount = transactions.filter((t) => {
    if (!t.active || !t.nextRunAt) return false;
    const nextRun = new Date(t.nextRunAt);
    return nextRun >= now && nextRun <= next7Days;
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Schedules in View */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--primary-muted)] text-[var(--primary)] rounded-[var(--radius-md)] shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Schedules {isFiltered ? "(Filtered)" : "in View"}
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
            {transactions.length}
            {totalCount !== undefined && totalCount > transactions.length ? (
              <span className="text-xs font-normal text-[var(--text-muted)] ml-1">
                of {totalCount}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {/* Active Schedules */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--success-muted)] text-[var(--success)] rounded-[var(--radius-md)] shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Active Schedules
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
            {activeCount}
          </p>
        </div>
      </div>

      {/* Paused Schedules */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--warning-muted)] text-[var(--warning)] rounded-[var(--radius-md)] shrink-0">
          <PauseCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Paused Schedules
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
            {pausedCount}
          </p>
        </div>
      </div>

      {/* Upcoming in 7 days */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--info-muted)] text-[var(--info)] rounded-[var(--radius-md)] shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Due Next 7 Days
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
            {upcoming7DaysCount}
          </p>
        </div>
      </div>
    </div>
  );
}
