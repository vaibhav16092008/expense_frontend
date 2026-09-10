"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCheck, Bell } from "lucide-react";
import { useMarkAllNotificationsAsRead, useUnreadCount } from "../hooks/useNotifications";
import { useToast } from "@/providers/ToastProvider";

export function NotificationsHeader() {
  const { data: unreadData, isLoading: isLoadingCount } = useUnreadCount();
  const markAllMutation = useMarkAllNotificationsAsRead();
  const { success, error } = useToast();

  const unreadCount = unreadData?.data?.count ?? 0;

  const handleMarkAllRead = async () => {
    if (unreadCount <= 0 || markAllMutation.isPending) return;

    try {
      const res = await markAllMutation.mutateAsync();
      const count = res?.data?.count ?? unreadCount;
      success(
        "Notifications marked as read",
        count > 0 ? `${count} unread notification(s) marked as read.` : "All notifications are now read."
      );
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error("Failed to mark all as read", errorObj.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Notifications
            </h1>
            {!isLoadingCount && unreadCount > 0 && (
              <Badge variant="primary" size="md" aria-label={`${unreadCount} unread notifications`}>
                {unreadCount} unread
              </Badge>
            )}
            {!isLoadingCount && unreadCount === 0 && (
              <Badge variant="neutral" size="md" aria-label="All notifications caught up">
                All caught up
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Stay updated on budget alerts, recurring payment reminders, and goal milestones.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || markAllMutation.isPending}
          isLoading={markAllMutation.isPending}
          leftIcon={<CheckCheck className="w-4 h-4 text-[var(--primary)]" />}
          aria-label="Mark all notifications as read"
        >
          Mark all as read
        </Button>
      </div>
    </div>
  );
}
