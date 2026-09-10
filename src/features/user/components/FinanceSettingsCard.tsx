"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { DollarSign, Wallet, Check } from "lucide-react";
import { useUserSettings, useUpdateUserSettings } from "../hooks/useUser";
import { useToast } from "@/providers/ToastProvider";
import { CurrencyCode } from "../types";

export function FinanceSettingsCard() {
  const { data: settings, isLoading, isError, error: fetchError } = useUserSettings();
  const updateMutation = useUpdateUserSettings();
  const { success, error } = useToast();

  const [userEditedCurrency, setUserEditedCurrency] = useState<CurrencyCode | null>(null);
  const [userEditedBudgetEnabled, setUserEditedBudgetEnabled] = useState<boolean | null>(null);
  const [userEditedBudgetAmount, setUserEditedBudgetAmount] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const currency = userEditedCurrency ?? settings?.currency ?? "INR";
  const budgetEnabled = userEditedBudgetEnabled ?? settings?.monthlyBudgetEnabled ?? false;
  const budgetAmount =
    userEditedBudgetAmount ?? (settings?.monthlyBudgetAmount ? String(settings.monthlyBudgetAmount) : "");

  const handleCurrencyChange = async (newCurrency: CurrencyCode) => {
    setUserEditedCurrency(newCurrency);
    try {
      await updateMutation.mutateAsync({ currency: newCurrency });
      success("Currency updated", `Default display currency set to ${newCurrency}.`);
    } catch (err: unknown) {
      setUserEditedCurrency(null);
      const errorObj = err as { message?: string };
      error("Failed to update currency", errorObj.message || "An unexpected error occurred.");
    }
  };

  const handleToggleBudgetEnabled = async (enabled: boolean) => {
    setUserEditedBudgetEnabled(enabled);
    setAmountError(null);

    if (!enabled) {
      // Disabling monthly budget automatically resets backend amount to null
      try {
        await updateMutation.mutateAsync({ monthlyBudgetEnabled: false });
        setUserEditedBudgetAmount(null);
        success("Monthly budget disabled", "Monthly budget tracking has been turned off.");
      } catch (err: unknown) {
        setUserEditedBudgetEnabled(null);
        const errorObj = err as { message?: string };
        error("Failed to update monthly budget", errorObj.message || "An unexpected error occurred.");
      }
    }
  };

  const handleSaveBudgetAmount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetEnabled) return;

    const trimmed = budgetAmount.trim();
    if (!trimmed) {
      setAmountError("Monthly budget amount is required when enabled");
      return;
    }

    const num = Number(trimmed);
    if (isNaN(num) || num <= 0) {
      setAmountError("Monthly budget amount must be greater than 0");
      return;
    }

    try {
      setAmountError(null);
      await updateMutation.mutateAsync({
        monthlyBudgetEnabled: true,
        monthlyBudgetAmount: trimmed,
      });
      setUserEditedBudgetAmount(null);
      success("Monthly budget saved", `Monthly target budget set to ${trimmed}.`);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setAmountError(errorObj.message || "Invalid amount format.");
      error("Failed to save budget amount", errorObj.message || "Please check your input.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" className="w-40 h-6" />
          <Skeleton variant="text" className="w-64 h-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton variant="rectangular" className="w-full h-16" />
          <Skeleton variant="rectangular" className="w-full h-24" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    const errorMsg = (fetchError as { message?: string })?.message || "Failed to load finance settings.";
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[var(--danger)]">Finance Settings Unavailable</CardTitle>
          <CardDescription>{errorMsg}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currencyOptions = [
    { value: "INR", label: "INR — Indian Rupee (₹)" },
    { value: "USD", label: "USD — US Dollar ($)" },
    { value: "EUR", label: "EUR — Euro (€)" },
    { value: "GBP", label: "GBP — British Pound (£)" },
    { value: "AED", label: "AED — UAE Dirham (AED)" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <Wallet className="w-5 h-5" />
          <CardTitle>Finance & Preferences</CardTitle>
        </div>
        <CardDescription>
          Configure active display currency and account-level monthly budget parameters.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Currency Preference */}
        <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <label htmlFor="currency-select" className="text-sm font-semibold text-[var(--text-primary)]">
                Default Currency
              </label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Display currency formatting used for financial summaries, budgets, and reports.
              </p>
            </div>
          </div>
          <Select
            id="currency-select"
            value={currency}
            options={currencyOptions}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            disabled={updateMutation.isPending}
            className="max-w-md"
          />
        </div>

        {/* Monthly Budget Setting */}
        <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] shrink-0 mt-0.5">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="setting-monthly-budget-toggle" className="text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                  Overall Monthly Budget
                </label>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Set a global monthly spending goal to monitor total overall expenses.
                </p>
              </div>
            </div>
            <input
              id="setting-monthly-budget-toggle"
              type="checkbox"
              checked={budgetEnabled}
              onChange={(e) => handleToggleBudgetEnabled(e.target.checked)}
              disabled={updateMutation.isPending}
              className="w-5 h-5 rounded accent-[var(--primary)] cursor-pointer shrink-0"
              aria-label="Toggle overall monthly budget"
            />
          </div>

          {budgetEnabled && (
            <form onSubmit={handleSaveBudgetAmount} className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex flex-col sm:flex-row items-end gap-3 max-w-md">
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  label="Target Monthly Amount"
                  value={budgetAmount}
                  onChange={(e) => {
                    setUserEditedBudgetAmount(e.target.value);
                    if (amountError) setAmountError(null);
                  }}
                  placeholder="e.g. 50000"
                  error={amountError || undefined}
                  required
                  disabled={updateMutation.isPending}
                />
                <Button
                  type="submit"
                  isLoading={updateMutation.isPending}
                  disabled={updateMutation.isPending || !budgetAmount}
                  className="w-full sm:w-auto shrink-0 gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save Amount
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
