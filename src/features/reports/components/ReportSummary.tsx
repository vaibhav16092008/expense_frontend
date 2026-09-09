"use client";

import React from "react";
import { FinancialSummaryData } from "../types";
import { formatCurrency } from "@/utils/formatting/currency";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { TrendingUp, TrendingDown, PiggyBank, Percent } from "lucide-react";

export interface ReportSummaryProps {
  summary?: FinancialSummaryData;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function ReportSummary({
  summary,
  isLoading = false,
  isError = false,
  onRetry,
}: ReportSummaryProps) {
  if (isError) {
    return (
      <ErrorState
        title="Summary unavailable"
        message="Could not load financial summary report."
        onRetry={onRetry}
      />
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] space-y-2 shadow-[var(--shadow-xs)]"
          >
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-7" />
          </div>
        ))}
      </div>
    );
  }

  const numIncome = parseFloat(summary.totalIncome) || 0;
  const numExpense = parseFloat(summary.totalExpense) || 0;
  const numSavings = parseFloat(summary.savings) || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Income */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--success-muted)] text-[var(--success)] rounded-[var(--radius-md)] shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Total Income
          </p>
          <p className="text-lg font-bold text-[var(--success)] mt-0.5">
            {formatCurrency(numIncome)}
          </p>
        </div>
      </div>

      {/* Total Expense */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--danger-muted)] text-[var(--danger)] rounded-[var(--radius-md)] shrink-0">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Total Expenses
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
            {formatCurrency(numExpense)}
          </p>
        </div>
      </div>

      {/* Net Savings */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--primary-muted)] text-[var(--primary)] rounded-[var(--radius-md)] shrink-0">
          <PiggyBank className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Net Savings
          </p>
          <p
            className={`text-lg font-bold mt-0.5 ${
              numSavings >= 0 ? "text-[var(--primary)]" : "text-[var(--danger)]"
            }`}
          >
            {formatCurrency(numSavings)}
          </p>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] flex items-center gap-3">
        <div className="p-2.5 bg-[var(--info-muted)] text-[var(--info)] rounded-[var(--radius-md)] shrink-0">
          <Percent className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
            Savings Rate
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
            {summary.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
