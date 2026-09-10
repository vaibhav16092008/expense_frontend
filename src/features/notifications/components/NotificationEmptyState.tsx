"use client";

import React from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { BellOff, CheckCircle2, FilterX } from "lucide-react";

export interface NotificationEmptyStateProps {
  unreadOnly?: boolean;
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

export function NotificationEmptyState({
  unreadOnly,
  hasFilters,
  onResetFilters,
}: NotificationEmptyStateProps) {
  if (unreadOnly) {
    return (
      <EmptyState
        icon={<CheckCircle2 className="w-8 h-8 text-[var(--success)]" />}
        title="You're all caught up!"
        description="There are no unread notifications right now. Check back later or view all past notifications."
        action={
          hasFilters && onResetFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<FilterX className="w-3.5 h-3.5" />}
            >
              Clear filters
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<BellOff className="w-8 h-8 text-[var(--text-muted)]" />}
      title="No notifications found"
      description={
        hasFilters
          ? "No notifications matched your current filter criteria."
          : "You don't have any notifications yet. Alerts and reminders will appear here when triggered."
      }
      action={
        hasFilters && onResetFilters ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<FilterX className="w-3.5 h-3.5" />}
          >
            Clear filters
          </Button>
        ) : undefined
      }
    />
  );
}
