"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Category } from "@/features/categories/types";
import { CreateTransactionPayload, Transaction, TransactionType } from "../types";

interface TransactionFormProps {
  initialData?: Partial<Transaction>;
  categories: Category[];
  onSubmit: (data: CreateTransactionPayload) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [type, setType] = useState<TransactionType>(initialData?.type || "EXPENSE");
  const [amount, setAmount] = useState<string>(initialData?.amount ? String(initialData.amount) : "");
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId || "");
  const [date, setDate] = useState<string>(
    initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [merchant, setMerchant] = useState<string>(initialData?.merchant || "");
  const [note, setNote] = useState<string>(initialData?.note || "");
  const [errors, setErrors] = useState<{ amount?: string; categoryId?: string; date?: string }>({});

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { amount?: string; categoryId?: string; date?: string } = {};

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    if (!categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!date) {
      newErrors.date = "Please select a date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit({
      type,
      amount: parsedAmount,
      categoryId,
      date,
      merchant: merchant.trim() || undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
        <button
          type="button"
          onClick={() => {
            setType("EXPENSE");
            if (categoryId && !categories.some((c) => c.id === categoryId && c.type === "EXPENSE")) {
              setCategoryId("");
            }
          }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            type === "EXPENSE"
              ? "bg-danger text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => {
            setType("INCOME");
            if (categoryId && !categories.some((c) => c.id === categoryId && c.type === "INCOME")) {
              setCategoryId("");
            }
          }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            type === "INCOME"
              ? "bg-success text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Income
        </button>
      </div>

      {/* Amount & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Amount ($)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />
      </div>

      {/* Category */}
      <Select
        label="Category"
        placeholder="Select Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={filteredCategories.map((c) => ({ label: c.name, value: c.id }))}
        error={errors.categoryId}
        required
      />

      {/* Merchant / Payee */}
      <Input
        label="Merchant / Payee (Optional)"
        placeholder="e.g. Starbucks, Amazon, Employer"
        value={merchant}
        onChange={(e) => setMerchant(e.target.value)}
      />

      {/* Note / Description */}
      <Textarea
        label="Notes (Optional)"
        placeholder="Add details about this transaction..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData?.id ? "Update Transaction" : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
};
