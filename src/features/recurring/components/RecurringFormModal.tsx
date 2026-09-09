"use client";

import React, { useState } from "react";
import {
  CreateRecurringTransactionPayload,
  RecurringFrequency,
  RecurringTransaction,
  TransactionType,
  UpdateRecurringTransactionPayload,
} from "../types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useCategories } from "@/features/categories/hooks/useCategories";

export interface RecurringFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (payload: CreateRecurringTransactionPayload) => Promise<void>;
  onSubmitUpdate: (id: string, payload: UpdateRecurringTransactionPayload) => Promise<void>;
  initialData?: RecurringTransaction | null;
  isLoading?: boolean;
}

interface FormContentProps {
  onClose: () => void;
  onSubmitCreate: (payload: CreateRecurringTransactionPayload) => Promise<void>;
  onSubmitUpdate: (id: string, payload: UpdateRecurringTransactionPayload) => Promise<void>;
  initialData?: RecurringTransaction | null;
  isLoading?: boolean;
}

function RecurringFormContent({
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  initialData,
  isLoading = false,
}: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [amount, setAmount] = useState<string>(initialData?.amount || "");
  const [type, setType] = useState<TransactionType>(initialData?.type || "EXPENSE");
  const [categoryId, setCategoryId] = useState<string>(initialData?.category?.id || "");
  const [frequency, setFrequency] = useState<RecurringFrequency>(
    initialData?.frequency || "MONTHLY"
  );
  const [startDate, setStartDate] = useState<string>(
    initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : ""
  );
  const [note, setNote] = useState<string>(initialData?.note || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories filtered by transaction type
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories(type);

  // When transaction type changes, clear category if it doesn't belong to new type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategoryId(""); // Clear category selection so incompatible category isn't sent
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!frequency) {
      newErrors.frequency = "Frequency is required";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        newErrors.endDate = "End date must be on or after start date";
      }
    }

    if (note && note.length > 500) {
      newErrors.note = "Note cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = endDate ? new Date(endDate).toISOString() : null;

    if (isEditing && initialData) {
      const payload: UpdateRecurringTransactionPayload = {};
      if (amount !== initialData.amount) payload.amount = amount;
      if (type !== initialData.type) payload.type = type;
      if (categoryId !== initialData.category?.id) payload.categoryId = categoryId;
      if (frequency !== initialData.frequency) payload.frequency = frequency;
      if (isoStartDate !== new Date(initialData.startDate).toISOString()) {
        payload.startDate = isoStartDate;
      }
      const initialIsoEnd = initialData.endDate
        ? new Date(initialData.endDate).toISOString()
        : null;
      if (isoEndDate !== initialIsoEnd) {
        payload.endDate = isoEndDate;
      }
      const initialNote = initialData.note || null;
      const currentNote = note.trim() || null;
      if (currentNote !== initialNote) {
        payload.note = currentNote;
      }

      await onSubmitUpdate(initialData.id, payload);
    } else {
      const payload: CreateRecurringTransactionPayload = {
        amount,
        type,
        categoryId,
        frequency,
        startDate: isoStartDate,
        endDate: isoEndDate,
        note: note.trim() || undefined,
      };

      await onSubmitCreate(payload);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {/* Transaction Type Radio Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">
          Type <span className="text-[var(--danger)]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("EXPENSE")}
            className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-md)] border transition-colors ${
              type === "EXPENSE"
                ? "bg-[var(--danger-muted)] border-[var(--danger)] text-[var(--danger)] font-semibold"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
            }`}
          >
            EXPENSE
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("INCOME")}
            className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-md)] border transition-colors ${
              type === "INCOME"
                ? "bg-[var(--success-muted)] border-[var(--success)] text-[var(--success)] font-semibold"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
            }`}
          >
            INCOME
          </button>
        </div>
      </div>

      {/* Amount & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
        />

        <Select
          label="Category"
          placeholder={isLoadingCategories ? "Loading categories..." : "Select category"}
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors.categoryId}
          disabled={isLoadingCategories}
          required
        />
      </div>

      {/* Frequency */}
      <Select
        label="Frequency"
        options={[
          { label: "Daily", value: "DAILY" },
          { label: "Weekly", value: "WEEKLY" },
          { label: "Monthly", value: "MONTHLY" },
          { label: "Yearly", value: "YEARLY" },
        ]}
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
        error={errors.frequency}
        required
      />

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={errors.startDate}
          required
        />

        <Input
          label="End Date (Optional)"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          error={errors.endDate}
          helperText="Leave empty for indefinite schedule"
        />
      </div>

      {/* Note */}
      <Textarea
        label="Note (Optional)"
        placeholder="Add description or memo..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        error={errors.note}
        rows={3}
      />

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {isEditing ? "Save Changes" : "Create Schedule"}
        </Button>
      </div>
    </form>
  );
}

export function RecurringFormModal({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  initialData,
  isLoading = false,
}: RecurringFormModalProps) {
  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Recurring Schedule" : "New Recurring Schedule"}
      description={
        isEditing
          ? "Update the parameters for this recurring transaction schedule."
          : "Create a new automated recurring income or expense schedule."
      }
      size="md"
    >
      {isOpen && (
        <RecurringFormContent
          key={`${initialData?.id || "new"}-${isOpen}`}
          onClose={onClose}
          onSubmitCreate={onSubmitCreate}
          onSubmitUpdate={onSubmitUpdate}
          initialData={initialData}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
}
