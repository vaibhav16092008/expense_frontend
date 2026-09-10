"use client";

import React from "react";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { NotificationType } from "../types";
import { FilterX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface NotificationFiltersProps {
  unreadOnly: boolean;
  typeFilter: NotificationType | "";
  onUnreadOnlyChange: (unreadOnly: boolean) => void;
  onTypeFilterChange: (type: NotificationType | "") => void;
  onResetFilters: () => void;
}

const TYPE_OPTIONS: SelectOption[] = [
  { label: "All types", value: "" },
  { label: "Budget Warning", value: "BUDGET_WARNING" },
  { label: "Budget Critical", value: "BUDGET_CRITICAL" },
  { label: "Budget Exceeded", value: "BUDGET_EXCEEDED" },
  { label: "Recurring Upcoming", value: "RECURRING_UPCOMING" },
  { label: "Recurring Due", value: "RECURRING_DUE" },
  { label: "Goal Deadline", value: "GOAL_DEADLINE" },
  { label: "Goal Progress", value: "GOAL_PROGRESS" },
  { label: "Monthly Summary", value: "MONTHLY_SUMMARY" },
];

export function NotificationFilters({
  unreadOnly,
  typeFilter,
  onUnreadOnlyChange,
  onTypeFilterChange,
  onResetFilters,
}: NotificationFiltersProps) {
  const hasActiveFilters = unreadOnly || Boolean(typeFilter);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--surface-secondary)]/60 border border-[var(--border-subtle)]">
      {/* Tabs for All vs Unread */}
      <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] shrink-0">
        <button
          type="button"
          onClick={() => onUnreadOnlyChange(false)}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]",
            !unreadOnly
              ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
          )}
          aria-pressed={!unreadOnly}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onUnreadOnlyChange(true)}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]",
            unreadOnly
              ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
          )}
          aria-pressed={unreadOnly}
        >
          Unread
        </button>
      </div>

      {/* Filter Dropdowns and Reset */}
      <div className="flex flex-wrap items-center gap-3 flex-1 justify-end min-w-[240px]">
        <div className="w-full sm:w-56">
          <Select
            aria-label="Filter by notification type"
            value={typeFilter}
            onChange={(e) => onTypeFilterChange((e.target.value as NotificationType) || "")}
            options={TYPE_OPTIONS}
            className="h-9 text-xs"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<FilterX className="w-3.5 h-3.5" />}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] h-9 shrink-0"
            aria-label="Reset filters"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
