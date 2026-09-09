"use client";

import React, { useState } from "react";
import {
  Budget,
  BudgetFilters,
  BudgetSummaryHeader,
  BudgetList,
  BudgetFormModal,
  DeleteBudgetDialog,
  useBudgets,
} from "@/features/budgets";
import { Button } from "@/components/ui/Button";
import { Plus, PieChart } from "lucide-react";

export default function BudgetsPage() {
  const [filters, setFilters] = useState<BudgetFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  // Fetch overall list to power summary header (unfiltered summary metrics)
  const { data: allBudgets = [] } = useBudgets({});

  const handleCreateNew = () => {
    setSelectedBudget(null);
    setIsFormOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = (budget: Budget) => {
    setBudgetToDelete(budget);
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <PieChart className="w-6 h-6 text-[var(--primary)]" />
            Budgets
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Set and monitor spending limits across overall expenses and categories.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleCreateNew}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Budget
        </Button>
      </div>

      {/* Summary Header Metric Cards */}
      <BudgetSummaryHeader budgets={allBudgets} />

      {/* Main Budget List & Filters */}
      <BudgetList
        filters={filters}
        onFilterChange={setFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      {/* Create / Edit Form Modal */}
      <BudgetFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        budget={selectedBudget}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBudgetDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        budget={budgetToDelete}
      />
    </div>
  );
}
