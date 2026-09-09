import React from "react";
import { Goal, GoalFilters, GoalStatus } from "../types";
import { useGoals } from "../hooks/useGoals";
import { GoalCard } from "./GoalCard";
import { GoalSkeleton } from "./GoalSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/features/transactions/components/Pagination";
import { Target, Plus, Search, Filter } from "lucide-react";

interface GoalListProps {
  filters: GoalFilters;
  onFilterChange: (filters: GoalFilters) => void;
  onAddContribution: (goal: Goal) => void;
  onViewDetails: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onPause: (goalId: string) => void;
  onResume: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onCreateNew: () => void;
  isActionPending?: boolean;
}

export const GoalList: React.FC<GoalListProps> = ({
  filters,
  onFilterChange,
  onAddContribution,
  onViewDetails,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onComplete,
  onCreateNew,
  isActionPending = false,
}) => {
  const { data, isLoading, error } = useGoals(filters);

  if (isLoading) {
    return <GoalSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 text-[var(--danger)] text-sm text-center">
        Failed to load financial goals. Please try refreshing the page.
      </div>
    );
  }

  const goals = data?.data || [];
  const pagination = data?.pagination || {
    totalItems: goals.length,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const hasActiveFilters = Boolean(
    filters.status || filters.search || filters.sortBy
  );

  return (
    <div className="space-y-6">
      {/* Filter Controls Bar */}
      <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <Filter className="w-3.5 h-3.5" />
            <span>Search & Filter Goals</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => onFilterChange({})}
              className="text-xs text-[var(--primary)] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Input
              placeholder="Search goal name..."
              value={filters.search || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  search: e.target.value || undefined,
                  page: 1,
                })
              }
              leftElement={<Search className="w-4 h-4 text-[var(--text-muted)]" />}
            />
          </div>

          <Select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: (e.target.value as GoalStatus) || undefined,
                page: 1,
              })
            }
            options={[
              { value: "", label: "All Statuses" },
              { value: "ACTIVE", label: "Active" },
              { value: "PAUSED", label: "Paused" },
              { value: "COMPLETED", label: "Completed" },
              { value: "OVERDUE", label: "Overdue" },
            ]}
          />

          <Select
            value={filters.sortBy || "createdAt"}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as GoalFilters["sortBy"],
              })
            }
            options={[
              { value: "createdAt", label: "Sort: Date Created" },
              { value: "deadline", label: "Sort: Target Deadline" },
              { value: "targetAmount", label: "Sort: Target Amount" },
              { value: "currentAmount", label: "Sort: Saved Amount" },
              { value: "name", label: "Sort: Name" },
            ]}
          />

          <Select
            value={filters.sortOrder || "desc"}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortOrder: e.target.value as "asc" | "desc",
              })
            }
            options={[
              { value: "desc", label: "Order: Descending" },
              { value: "asc", label: "Order: Ascending" },
            ]}
          />
        </div>
      </div>

      {/* Goal Cards Grid / Empty State */}
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8 text-[var(--primary)]" />}
          title={hasActiveFilters ? "No matching financial goals" : "No financial goals created yet"}
          description={
            hasActiveFilters
              ? "Try clearing or updating your search filters."
              : "Set up long-term savings goals like an Emergency Fund, Vacation, or Debt Payoff."
          }
          action={
            <Button variant="primary" size="sm" onClick={onCreateNew} leftIcon={<Plus className="w-4 h-4" />}>
              Create First Goal
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddContribution={onAddContribution}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onPause={onPause}
                onResume={onResume}
                onComplete={onComplete}
                isActionPending={isActionPending}
              />
            ))}
          </div>

          <Pagination
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={pagination.totalItems}
            limit={pagination.itemsPerPage}
            onPageChange={(page) => onFilterChange({ ...filters, page })}
          />
        </div>
      )}
    </div>
  );
};
