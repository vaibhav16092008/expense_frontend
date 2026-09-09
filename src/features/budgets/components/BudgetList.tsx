import React from "react";
import { Budget, BudgetFilters, BudgetType, BudgetPeriod, BudgetStatus } from "../types";
import { useBudgets } from "../hooks/useBudgets";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { BudgetCard } from "./BudgetCard";
import { BudgetSkeleton } from "./BudgetSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { PieChart, Plus, Filter } from "lucide-react";

interface BudgetListProps {
  filters: BudgetFilters;
  onFilterChange: (filters: BudgetFilters) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  onCreateNew: () => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  filters,
  onFilterChange,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const { data: budgets = [], isLoading, error } = useBudgets(filters);
  const { data: expenseCategories = [] } = useCategories("EXPENSE");

  if (isLoading) {
    return <BudgetSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 text-[var(--danger)] text-sm text-center">
        Failed to load budgets. Please try refreshing the page.
      </div>
    );
  }

  const hasActiveFilters = Boolean(
    filters.type || filters.period || filters.status || filters.categoryId
  );

  return (
    <div className="space-y-6">
      {/* Backend-supported Filter Controls (NO SEARCH FIELD) */}
      <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Budgets</span>
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
          <Select
            value={filters.type || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                type: (e.target.value as BudgetType) || undefined,
              })
            }
            options={[
              { value: "", label: "All Types" },
              { value: "OVERALL", label: "Overall" },
              { value: "CATEGORY", label: "Category Specific" },
            ]}
          />

          <Select
            value={filters.period || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                period: (e.target.value as BudgetPeriod) || undefined,
              })
            }
            options={[
              { value: "", label: "All Periods" },
              { value: "MONTHLY", label: "Monthly" },
              { value: "WEEKLY", label: "Weekly" },
              { value: "CUSTOM", label: "Custom Range" },
            ]}
          />

          <Select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: (e.target.value as BudgetStatus) || undefined,
              })
            }
            options={[
              { value: "", label: "All Statuses" },
              { value: "ON_TRACK", label: "On Track" },
              { value: "WARNING", label: "Warning (70%+)" },
              { value: "CRITICAL", label: "Critical (90%+)" },
              { value: "EXCEEDED", label: "Exceeded (100%+)" },
            ]}
          />

          <Select
            value={filters.categoryId || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                categoryId: e.target.value || undefined,
              })
            }
            options={[
              { value: "", label: "All Expense Categories" },
              ...expenseCategories.map((c) => ({
                value: c.id,
                label: c.name,
              })),
            ]}
          />
        </div>
      </div>

      {/* Budget Grid / Empty State */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={<PieChart className="w-8 h-8 text-[var(--primary)]" />}
          title={hasActiveFilters ? "No matching budgets found" : "No budgets created yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters to view existing budgets."
              : "Set up overall or category spending budgets to keep track of your financial limits."
          }
          action={
            <Button variant="primary" size="sm" onClick={onCreateNew} leftIcon={<Plus className="w-4 h-4" />}>
              Create First Budget
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
