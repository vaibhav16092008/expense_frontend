"use client";

import React, { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { NotificationType } from "../types";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationCard } from "./NotificationCard";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NotificationList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse query params from URL
  const pageParam = Number(searchParams.get("page")) || 1;
  const unreadOnlyParam = searchParams.get("unreadOnly") === "true";
  const typeParam = (searchParams.get("type") as NotificationType) || "";

  // Helper to update URL search parameters
  const updateUrlParams = useCallback(
    (newParams: { page?: number; unreadOnly?: boolean; type?: NotificationType | "" }) => {
      const params = new URLSearchParams(searchParams.toString());

      const targetPage = newParams.page !== undefined ? newParams.page : pageParam;
      const targetUnread = newParams.unreadOnly !== undefined ? newParams.unreadOnly : unreadOnlyParam;
      const targetType = newParams.type !== undefined ? newParams.type : typeParam;

      if (targetPage > 1) {
        params.set("page", String(targetPage));
      } else {
        params.delete("page");
      }

      if (targetUnread) {
        params.set("unreadOnly", "true");
      } else {
        params.delete("unreadOnly");
      }

      if (targetType) {
        params.set("type", targetType);
      } else {
        params.delete("type");
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, pageParam, unreadOnlyParam, typeParam]
  );

  // Fetch notifications using custom hook
  const { data, isLoading, isError, error, refetch } = useNotifications({
    page: pageParam,
    limit: 20,
    unreadOnly: unreadOnlyParam,
    type: typeParam || undefined,
  });

  const notifications = data?.data || [];
  const pagination = data?.pagination || {
    page: pageParam,
    limit: 20,
    totalCount: notifications.length,
    totalPages: 1,
    hasMore: false,
  };

  const handleUnreadOnlyChange = (unreadOnly: boolean) => {
    updateUrlParams({ unreadOnly, page: 1 });
  };

  const handleTypeFilterChange = (type: NotificationType | "") => {
    updateUrlParams({ type, page: 1 });
  };

  const handleResetFilters = () => {
    updateUrlParams({ unreadOnly: false, type: "", page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    updateUrlParams({ page: newPage });
  };

  const hasFilters = unreadOnlyParam || Boolean(typeParam);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <NotificationsHeader />

      {/* Filter Toolbar */}
      <NotificationFilters
        unreadOnly={unreadOnlyParam}
        typeFilter={typeParam}
        onUnreadOnlyChange={handleUnreadOnlyChange}
        onTypeFilterChange={handleTypeFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main List Area */}
      {isLoading ? (
        <NotificationSkeleton />
      ) : isError ? (
        <ErrorState
          title="Unable to load notifications"
          message={
            (error as { message?: string })?.message ||
            "An error occurred while communicating with the notification server."
          }
          onRetry={() => refetch()}
        />
      ) : notifications.length === 0 ? (
        <NotificationEmptyState
          unreadOnly={unreadOnlyParam}
          hasFilters={hasFilters}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && !isError && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          <div>
            Showing{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {pagination.totalCount}
            </span>{" "}
            notifications
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              aria-label="Previous page"
            >
              Previous
            </Button>

            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore || pagination.page >= pagination.totalPages}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
