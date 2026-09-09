"use client";

import React, { useState } from "react";
import {
  DateRangeParams,
  ReportGroupBy,
} from "@/features/reports/types";
import {
  useBudgetReport,
  useCashFlowReport,
  useCategoryReport,
  useFinancialSummaryReport,
  useSavingsReport,
} from "@/features/reports/hooks/useReports";
import {
  formatDateYYYYMMDD,
  ReportDateRange,
} from "@/features/reports/components/ReportDateRange";
import { ReportSummary } from "@/features/reports/components/ReportSummary";
import { CashFlowReport } from "@/features/reports/components/CashFlowReport";
import { CategoryReport } from "@/features/reports/components/CategoryReport";
import { BudgetReport } from "@/features/reports/components/BudgetReport";
import { SavingsReport } from "@/features/reports/components/SavingsReport";
import { ReportExportMenu } from "@/features/reports/components/ReportExportMenu";
import { BarChart3 } from "lucide-react";

function getInitialDateRange(): DateRangeParams {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return {
    from: formatDateYYYYMMDD(new Date(y, m, 1)),
    to: formatDateYYYYMMDD(new Date(y, m + 1, 0)),
  };
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRangeParams>(getInitialDateRange);
  const [cashFlowGroupBy, setCashFlowGroupBy] = useState<ReportGroupBy>("month");
  const [savingsGroupBy, setSavingsGroupBy] = useState<ReportGroupBy>("month");

  // Report Queries
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useFinancialSummaryReport(dateRange);

  const {
    data: cashFlowData,
    isLoading: isCashFlowLoading,
    isError: isCashFlowError,
    refetch: refetchCashFlow,
  } = useCashFlowReport({ ...dateRange, groupBy: cashFlowGroupBy });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    refetch: refetchCategory,
  } = useCategoryReport(dateRange);

  const {
    data: budgetData,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
    refetch: refetchBudget,
  } = useBudgetReport(dateRange);

  const {
    data: savingsData,
    isLoading: isSavingsLoading,
    isError: isSavingsError,
    refetch: refetchSavings,
  } = useSavingsReport({ ...dateRange, groupBy: savingsGroupBy });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[var(--primary)] shrink-0" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Reports & Analytics
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Cashflow breakdown, category distribution, budget performance, and data exports.
          </p>
        </div>

        {/* Export Actions Header Menu */}
        <ReportExportMenu dateRange={dateRange} groupBy={cashFlowGroupBy} />
      </div>

      {/* Date Range & Presets Toolbar */}
      <ReportDateRange dateRange={dateRange} onChange={setDateRange} />

      {/* Top Metrics Summary */}
      <ReportSummary
        summary={summaryData}
        isLoading={isSummaryLoading}
        isError={isSummaryError}
        onRetry={refetchSummary}
      />

      {/* Charts Grid: Cash Flow & Category Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowReport
          data={cashFlowData}
          groupBy={cashFlowGroupBy}
          onGroupByChange={setCashFlowGroupBy}
          isLoading={isCashFlowLoading}
          isError={isCashFlowError}
          onRetry={refetchCashFlow}
        />

        <CategoryReport
          data={categoryData}
          isLoading={isCategoryLoading}
          isError={isCategoryError}
          onRetry={refetchCategory}
        />
      </div>

      {/* Grid: Budget Performance & Savings Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetReport
          data={budgetData}
          isLoading={isBudgetLoading}
          isError={isBudgetError}
          onRetry={refetchBudget}
        />

        <SavingsReport
          data={savingsData}
          groupBy={savingsGroupBy}
          onGroupByChange={setSavingsGroupBy}
          isLoading={isSavingsLoading}
          isError={isSavingsError}
          onRetry={refetchSavings}
        />
      </div>
    </div>
  );
}
