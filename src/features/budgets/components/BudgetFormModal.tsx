import React, { useState } from "react";
import { Budget, BudgetType, BudgetPeriod } from "../types";
import { useCreateBudget, useUpdateBudget } from "../hooks/useBudgets";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/providers/ToastProvider";

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
}

function getMonthlyDates(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0];
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).toISOString().split("T")[0];
  return { startDate: firstDay, endDate: lastDay };
}

function getWeeklyDates(startDateStr?: string) {
  const start = startDateStr ? new Date(startDateStr) : new Date();
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth();
  const day = start.getUTCDate();

  const startDate = new Date(Date.UTC(year, month, day)).toISOString().split("T")[0];
  const endDate = new Date(Date.UTC(year, month, day + 6)).toISOString().split("T")[0];
  return { startDate, endDate };
}

const BudgetFormContent: React.FC<{
  budget?: Budget | null;
  onClose: () => void;
}> = ({ budget, onClose }) => {
  const isEditing = Boolean(budget);
  const toast = useToast();

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories("EXPENSE");
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();

  const defaultMonthly = getMonthlyDates();

  const [type, setType] = useState<BudgetType>(budget?.type || "OVERALL");
  const [period, setPeriod] = useState<BudgetPeriod>(budget?.period || "MONTHLY");
  const [categoryId, setCategoryId] = useState<string>(budget?.category?.id || "");
  const [amount, setAmount] = useState<string>(budget?.amount || "");
  const [startDate, setStartDate] = useState<string>(
    budget?.startDate ? budget.startDate.split("T")[0] : defaultMonthly.startDate
  );
  const [endDate, setEndDate] = useState<string>(
    budget?.endDate ? budget.endDate.split("T")[0] : defaultMonthly.endDate
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handlePeriodChange = (newPeriod: BudgetPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod === "MONTHLY") {
      const dates = getMonthlyDates(startDate);
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    } else if (newPeriod === "WEEKLY") {
      const dates = getWeeklyDates(startDate);
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    }
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (period === "MONTHLY") {
      const dates = getMonthlyDates(newStart);
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    } else if (period === "WEEKLY") {
      const dates = getWeeklyDates(newStart);
      setEndDate(dates.endDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Budget amount must be a positive number greater than 0");
      return;
    }

    if (type === "CATEGORY" && !categoryId) {
      setFormError("Expense category is required for category budget");
      return;
    }

    if (!startDate || !endDate) {
      setFormError("Start date and end date are required");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setFormError("End date must be greater than or equal to start date");
      return;
    }

    try {
      if (isEditing && budget) {
        await updateBudgetMutation.mutateAsync({
          id: budget.id,
          payload: {
            amount,
            type,
            period,
            startDate,
            endDate,
            categoryId: type === "CATEGORY" ? categoryId : null,
          },
        });
        toast.success("Budget updated successfully");
      } else {
        await createBudgetMutation.mutateAsync({
          amount,
          type,
          period,
          startDate,
          endDate,
          categoryId: type === "CATEGORY" ? categoryId : null,
        });
        toast.success("Budget created successfully");
      }
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to save budget";
      setFormError(errorMessage);
    }
  };

  const isSubmitting = createBudgetMutation.isPending || updateBudgetMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {formError && (
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--danger)]/10 text-[var(--danger)] text-xs font-medium">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Budget Type"
          value={type}
          onChange={(e) => setType(e.target.value as BudgetType)}
          disabled={isSubmitting}
          required
          options={[
            { value: "OVERALL", label: "Overall Spending" },
            { value: "CATEGORY", label: "Category Specific" },
          ]}
        />

        <Select
          label="Budget Period"
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value as BudgetPeriod)}
          disabled={isSubmitting}
          required
          options={[
            { value: "MONTHLY", label: "Monthly" },
            { value: "WEEKLY", label: "Weekly" },
            { value: "CUSTOM", label: "Custom Range" },
          ]}
        />
      </div>

      {type === "CATEGORY" && (
        <Select
          label="Expense Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isSubmitting || isLoadingCategories}
          required
          options={[
            { value: "", label: "Select an expense category..." },
            ...categories.map((c) => ({
              value: c.id,
              label: c.name,
            })),
          ]}
          helperText="Budgets can only be set for Expense categories."
        />
      )}

      <Input
        label="Budget Amount ($)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="e.g. 500.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          disabled={isSubmitting}
          required
          helperText={
            period === "MONTHLY"
              ? "First day of UTC month"
              : period === "WEEKLY"
              ? "Start of 7-day period"
              : undefined
          }
        />

        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={isSubmitting || period !== "CUSTOM"}
          required
          helperText={
            period === "MONTHLY"
              ? "Last day of month (auto)"
              : period === "WEEKLY"
              ? "Auto +6 days (7 days)"
              : undefined
          }
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEditing ? "Save Changes" : "Create Budget"}
        </Button>
      </div>
    </form>
  );
};

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  budget,
}) => {
  const isEditing = Boolean(budget);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Budget" : "Create Budget"}
      description={
        isEditing
          ? "Update your spending limit, period, or date scope."
          : "Set a spending limit for overall expenses or a specific category."
      }
    >
      {isOpen && (
        <BudgetFormContent
          key={`${budget?.id || "new"}-${isOpen}`}
          budget={budget}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};
