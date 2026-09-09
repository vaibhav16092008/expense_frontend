"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Category } from "@/features/categories/types";
import { X } from "lucide-react";
import { CategoryType, TransactionFilters as FilterType } from "../types";
import { TransactionSearch } from "./TransactionSearch";

interface TransactionFiltersProps {
  filters: FilterType;
  categories: Category[];
  onFilterChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  categories,
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.categoryId || filters.startDate || filters.endDate
  );

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-surface border border-border rounded-xl shadow-xs">
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1">
        {/* Search */}
        <TransactionSearch
          value={filters.search || ""}
          onChange={(search) => onFilterChange({ search, page: 1 })}
        />

        {/* Type Select */}
        <div className="w-full sm:w-36">
          <Select
            value={filters.type || ""}
            onChange={(e) => onFilterChange({ type: e.target.value as CategoryType | "", page: 1 })}
            options={[
              { label: "All Types", value: "" },
              { label: "Expense", value: "EXPENSE" },
              { label: "Income", value: "INCOME" },
            ]}
          />
        </div>

        {/* Category Select */}
        <div className="w-full sm:w-44">
          <Select
            value={filters.categoryId || ""}
            onChange={(e) => onFilterChange({ categoryId: e.target.value, page: 1 })}
            options={[
              { label: "All Categories", value: "" },
              ...categories.map((c) => ({ label: c.name, value: c.id })),
            ]}
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onFilterChange({ startDate: e.target.value, page: 1 })}
            className="h-10 text-xs w-32"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => onFilterChange({ endDate: e.target.value, page: 1 })}
            className="h-10 text-xs w-32"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<X className="w-4 h-4" />}
          className="self-start lg:self-center text-muted-foreground hover:text-foreground"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
