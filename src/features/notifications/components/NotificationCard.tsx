"use client";

import React, { useState } from "react";
import { NotificationObject, NotificationSeverity, NotificationType } from "../types";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { formatDate, formatRelativeTime } from "@/utils/formatting/date";
import { useDeleteNotification, useMarkNotificationAsRead } from "../hooks/useNotifications";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils/cn";
import {
  Wallet,
  AlertTriangle,
  AlertOctagon,
  Repeat,
  Clock,
  Target,
  Trophy,
  BarChart3,
  Trash2,
  CheckCircle,
  Info,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

export interface NotificationCardProps {
  notification: NotificationObject;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  BUDGET_WARNING: {
    label: "Budget Warning",
    icon: AlertTriangle,
    iconBg: "bg-[var(--warning-muted)]",
    iconColor: "text-[var(--warning)]",
  },
  BUDGET_CRITICAL: {
    label: "Budget Critical",
    icon: Wallet,
    iconBg: "bg-[var(--danger-muted)]",
    iconColor: "text-[var(--danger)]",
  },
  BUDGET_EXCEEDED: {
    label: "Budget Exceeded",
    icon: AlertOctagon,
    iconBg: "bg-[var(--danger-muted)]",
    iconColor: "text-[var(--danger)]",
  },
  RECURRING_UPCOMING: {
    label: "Recurring Upcoming",
    icon: Clock,
    iconBg: "bg-[var(--info-muted)]",
    iconColor: "text-[var(--info)]",
  },
  RECURRING_DUE: {
    label: "Recurring Due",
    icon: Repeat,
    iconBg: "bg-[var(--warning-muted)]",
    iconColor: "text-[var(--warning)]",
  },
  GOAL_DEADLINE: {
    label: "Goal Deadline",
    icon: Target,
    iconBg: "bg-[var(--warning-muted)]",
    iconColor: "text-[var(--warning)]",
  },
  GOAL_PROGRESS: {
    label: "Goal Progress",
    icon: Trophy,
    iconBg: "bg-[var(--success-muted)]",
    iconColor: "text-[var(--success)]",
  },
  MONTHLY_SUMMARY: {
    label: "Monthly Summary",
    icon: BarChart3,
    iconBg: "bg-[var(--primary-muted)]",
    iconColor: "text-[var(--primary)]",
  },
};

const SEVERITY_CONFIG: Record<
  NotificationSeverity,
  { variant: "info" | "warning" | "danger"; icon: LucideIcon }
> = {
  INFO: { variant: "info", icon: Info },
  WARNING: { variant: "warning", icon: AlertTriangle },
  CRITICAL: { variant: "danger", icon: AlertCircle },
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const markReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();
  const { success, error } = useToast();

  const typeConfig = TYPE_CONFIG[notification.type] || {
    label: notification.type,
    icon: Info,
    iconBg: "bg-[var(--surface-secondary)]",
    iconColor: "text-[var(--text-secondary)]",
  };

  const severityConfig = SEVERITY_CONFIG[notification.severity] || SEVERITY_CONFIG.INFO;
  const TypeIcon = typeConfig.icon;
  const SeverityIcon = severityConfig.icon;

  const handleCardClick = () => {
    if (!notification.isRead && !markReadMutation.isPending) {
      markReadMutation.mutate(notification.id);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(notification.id);
      setIsDeleteDialogOpen(false);
      success("Notification deleted", "The notification was permanently deleted.");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error("Failed to delete notification", errorObj.message || "An unexpected error occurred.");
    }
  };

  const formattedTime = formatRelativeTime(notification.createdAt);
  const fullDateStr = formatDate(notification.createdAt, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div
        onClick={handleCardClick}
        className={cn(
          "group relative p-4 rounded-[var(--radius-lg)] border transition-all duration-200 flex items-start gap-3.5 sm:gap-4 select-none cursor-pointer",
          !notification.isRead
            ? "bg-[var(--surface)] border-[var(--primary)]/40 shadow-[var(--shadow-sm)] hover:border-[var(--primary)]"
            : "bg-[var(--surface-secondary)]/30 border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--surface-secondary)]/60"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${notification.isRead ? "Read" : "Unread"} notification: ${notification.title}`}
      >
        {/* Unread indicator bar/dot */}
        {!notification.isRead && (
          <span
            className="absolute top-4 left-2.5 w-2 h-2 rounded-full bg-[var(--primary)] shrink-0"
            aria-hidden="true"
          />
        )}

        {/* Notification Type Icon */}
        <div
          className={cn(
            "p-2.5 rounded-[var(--radius-md)] shrink-0 mt-0.5 transition-transform group-hover:scale-105",
            typeConfig.iconBg,
            typeConfig.iconColor,
            !notification.isRead ? "ml-2" : ""
          )}
        >
          <TypeIcon className="w-5 h-5" aria-hidden="true" />
        </div>

        {/* Notification Main Content */}
        <div className="flex-1 min-w-0 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={cn(
                "text-sm tracking-tight leading-snug break-words",
                !notification.isRead
                  ? "font-bold text-[var(--text-primary)]"
                  : "font-semibold text-[var(--text-primary)]/80"
              )}
            >
              {notification.title}
            </h3>

            {/* Type badge */}
            <Badge variant="neutral" size="sm">
              {typeConfig.label}
            </Badge>

            {/* Severity badge */}
            <Badge
              variant={severityConfig.variant}
              size="sm"
              className="flex items-center gap-1"
              aria-label={`Severity: ${notification.severity}`}
            >
              <SeverityIcon className="w-3 h-3" />
              <span>{notification.severity}</span>
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words mb-2">
            {notification.message}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            <time dateTime={notification.createdAt} title={fullDateStr}>
              {formattedTime}
            </time>

            {!notification.isRead && (
              <span className="flex items-center gap-1 text-[var(--primary)] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                Unread
              </span>
            )}

            {notification.isRead && (
              <span className="flex items-center gap-1 text-[var(--text-muted)]">
                <CheckCircle className="w-3 h-3 text-[var(--success)]" />
                Read
              </span>
            )}
          </div>
        </div>

        {/* Delete Action Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-muted)] rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--danger)]"
            aria-label={`Delete notification ${notification.title}`}
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
