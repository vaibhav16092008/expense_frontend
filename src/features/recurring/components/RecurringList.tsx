"use client";

import React, { useState } from "react";
import {
  Pagination,
  RecurringFilters,
  RecurringFrequency,
  RecurringTransaction,
  TransactionType,
} from "../types";
import { RecurringCard } from "./RecurringCard";
import { RecurringSkeleton } from "./RecurringSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { useCategories } from "@/features/categories/hooks/useCategories";
import {
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export interface RecurringListProps {
  transactions: RecurringTransaction[];
  pagination: Pagination;
  filters: RecurringFilters;
  onFilterChange: (newFilters: RecurringFilters) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenCreate: () => void;
  onEdit: (recurring: RecurringTransaction) => void;
  onDelete: (recurring: RecurringTransaction) => void;
  onDetails: (recurring: RecurringTransaction) => void;
  onPause: (recurring: RecurringTransaction) => void;
  onResume: (recurring: RecurringTransaction) => void;
  actionLoadingId?: string | null;
}

export function RecurringList({
  transactions,
  pagination,
  filters,
  onFilterChange,
  isLoading,
  isError,
  onRetry,
  onOpenCreate,
  onEdit,
  onDelete,
  onDetails,
  onPause,
  onResume,
  actionLoadingId = null,
}: RecurringListProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all categories for filter dropdown
  const { data: categories = [] } = useCategories();

  const handleActiveChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      active: val === "all" ? undefined : val === "true",
    });
  };

  const handleTypeChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      type: val === "all" ? undefined : (val as TransactionType),
    });
  };

  const handleFrequencyChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      frequency: val === "all" ? undefined : (val as RecurringFrequency),
    });
  };

  const handleCategoryChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      categoryId: val === "all" ? undefined : val,
    });
  };

  const handleStartDateChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      startDate: val ? new Date(val).toISOString() : undefined,
    });
  };

  const handleEndDateChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      endDate: val ? new Date(val).toISOString() : undefined,
    });
  };

  const handleSortByChange = (val: string) => {
    onFilterChange({
      ...filters,
      sortBy: val as "nextRunAt" | "createdAt" | "amount",
    });
  };

  const handleSortOrderChange = (val: string) => {
    onFilterChange({
      ...filters,
      sortOrder: val as "asc" | "desc",
    });
  };

  const handleLimitChange = (val: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      limit: Number(val),
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit ?? 20,
    });
  };

  const hasActiveFilters = Boolean(
    filters.active !== undefined ||
      filters.type ||
      filters.frequency ||
      filters.categoryId ||
      filters.startDate ||
      filters.endDate ||
      filters.sortBy ||
      filters.sortOrder
  );

  if (isError) {
    return (
      <ErrorState
        title="Unable to load recurring transactions"
        message="An error occurred while fetching recurring schedules from the server."
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Toolbar Header */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters {hasActiveFilters && "• Active"}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* Create Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Schedule
          </Button>
        </div>

        {/* Expandable Filter Controls */}
        {showFilters && (
          <div className="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Status Filter */}
            <Select
              label="Status"
              value={
                filters.active === undefined
                  ? "all"
                  : filters.active
                  ? "true"
                  : "false"
              }
              onChange={(e) => handleActiveChange(e.target.value)}
              options={[
                { label: "All Statuses", value: "all" },
                { label: "Active Only", value: "true" },
                { label: "Paused Only", value: "false" },
              ]}
            />

            {/* Type Filter */}
            <Select
              label="Type"
              value={filters.type || "all"}
              onChange={(e) => handleTypeChange(e.target.value)}
              options={[
                { label: "All Types", value: "all" },
                { label: "EXPENSE Only", value: "EXPENSE" },
                { label: "INCOME Only", value: "INCOME" },
              ]}
            />

            {/* Frequency Filter */}
            <Select
              label="Frequency"
              value={filters.frequency || "all"}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              options={[
                { label: "All Frequencies", value: "all" },
                { label: "Daily", value: "DAILY" },
                { label: "Weekly", value: "WEEKLY" },
                { label: "Monthly", value: "MONTHLY" },
                { label: "Yearly", value: "YEARLY" },
              ]}
            />

            {/* Category Filter */}
            <Select
              label="Category"
              value={filters.categoryId || "all"}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={[
                { label: "All Categories", value: "all" },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ]}
            />

            {/* Schedule Start Date Filter */}
            <Input
              label="Schedule Start From"
              type="date"
              value={
                filters.startDate
                  ? filters.startDate.split("T")[0]
                  : ""
              }
              onChange={(e) => handleStartDateChange(e.target.value)}
            />

            {/* Schedule End Date Filter */}
            <Input
              label="Schedule Start To"
              type="date"
              value={
                filters.endDate
                  ? filters.endDate.split("T")[0]
                  : ""
              }
              onChange={(e) => handleEndDateChange(e.target.value)}
            />

            {/* Sort By */}
            <Select
              label="Sort By"
              value={filters.sortBy || "nextRunAt"}
              onChange={(e) => handleSortByChange(e.target.value)}
              options={[
                { label: "Next Run Date", value: "nextRunAt" },
                { label: "Creation Date", value: "createdAt" },
                { label: "Amount", value: "amount" },
              ]}
            />

            {/* Sort Order */}
            <Select
              label="Sort Order"
              value={filters.sortOrder || "asc"}
              onChange={(e) => handleSortOrderChange(e.target.value)}
              options={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <RecurringSkeleton />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-8 h-8 text-[var(--text-muted)]" />}
          title={hasActiveFilters ? "No schedules match your filters" : "No recurring schedules yet"}
          description={
            hasActiveFilters
              ? "Try resetting your active filters to view all scheduled transactions."
              : "Create automated recurring schedules for your regular income and bills."
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenCreate}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create First Schedule
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((rec) => (
            <RecurringCard
              key={rec.id}
              recurring={rec}
              onEdit={onEdit}
              onDelete={onDelete}
              onDetails={onDetails}
              onPause={onPause}
              onResume={onResume}
              isActionLoading={actionLoadingId === rec.id}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer Bar */}
      {!isLoading && transactions.length > 0 && (
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <span>
              Page <strong className="text-[var(--text-primary)]">{pagination.page}</strong> of{" "}
              <strong className="text-[var(--text-primary)]">{pagination.totalPages}</strong> (
              {pagination.totalCount} total schedules)
            </span>

            {/* Items per page selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted)]">Per page:</span>
              <select
                value={filters.limit || 20}
                onChange={(e) => handleLimitChange(e.target.value)}
                className="h-7 px-2 bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border)] rounded-[var(--radius-sm)] text-xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  page: pagination.page - 1,
                })
              }
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasMore && pagination.page >= pagination.totalPages}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  page: pagination.page + 1,
                })
              }
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
