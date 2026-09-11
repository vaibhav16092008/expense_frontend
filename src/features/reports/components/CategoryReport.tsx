"use client";

import React from "react";
import { CategoryReportData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEFAULT_COLORS } from "@/features/categories/components/IconPicker";
import { formatCurrency } from "@/utils/formatting/currency";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

export interface CategoryReportProps {
  data?: CategoryReportData;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

export const CategoryReport = React.memo(function CategoryReport({
  data,
  isLoading = false,
  isError = false,
  onRetry,
}: CategoryReportProps) {
  const items = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      ...item,
      numericAmount: parseFloat(item.amount) || 0,
    }));
  }, [data?.data]);

  const totalExpenseNum = React.useMemo(() => {
    return parseFloat(data?.totalExpense || "0") || 0;
  }, [data?.totalExpense]);

  if (isError) {
    return (
      <ErrorState
        title="Category Report Unavailable"
        message="Failed to load category spending analytics from the server."
        onRetry={onRetry}
      />
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="h-80">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="h-60 pt-4">
          <Skeleton className="h-full w-full rounded-[var(--radius-md)]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-[380px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[var(--primary)]" />
            Category Spending Distribution
          </CardTitle>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Total Expense:{" "}
            <strong className="text-[var(--text-primary)]">
              {formatCurrency(totalExpenseNum)}
            </strong>
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col lg:flex-row gap-6 pt-4">
        {items.length === 0 ? (
          <EmptyState
            title="No expense spending found"
            description="There are no expense transactions logged in this date range."
            className="w-full min-h-[220px]"
          />
        ) : (
          <>
            {/* Donut Chart */}
            <div className="h-56 w-full lg:w-1/2 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={items}
                    dataKey="numericAmount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {items.map((_, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value: unknown) => [formatCurrency(Number(value || 0)), "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Table / List */}
            <div className="flex-1 overflow-y-auto max-h-64 pr-1 space-y-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-semibold">
                    <th className="py-2 pl-1">Category</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2 pr-1 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {items.map((item, idx) => (
                    <tr key={item.categoryId || idx} className="hover:bg-[var(--surface-secondary)]/50 transition-colors">
                      <td className="py-2 pl-1">
                        <div className="flex items-center gap-2 truncate max-w-[150px]">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
                            }}
                          />
                          <span className="font-medium text-[var(--text-primary)] truncate">
                            {item.categoryName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-right font-medium text-[var(--text-primary)]">
                        {formatCurrency(item.numericAmount)}
                      </td>
                      <td className="py-2 pr-1 text-right text-[var(--text-muted)]">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});
