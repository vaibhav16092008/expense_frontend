"use client";

import React from "react";
import { CashFlowReportData, ReportGroupBy } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatting/currency";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

export interface CashFlowReportProps {
  data?: CashFlowReportData;
  groupBy: ReportGroupBy;
  onGroupByChange: (newGroupBy: ReportGroupBy) => void;
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
const LEGEND_WRAPPER_STYLE: React.CSSProperties = { paddingTop: "10px", fontSize: "12px" };
const CHART_MARGIN = { top: 10, right: 20, left: 0, bottom: 0 };
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];
const XAXIS_TICK = { fill: "var(--text-muted)", fontSize: 11 };
const YAXIS_TICK = { fill: "var(--text-muted)", fontSize: 11 };
const formatYAxis = (val: number | string) => `$${val}`;

export const CashFlowReport = React.memo(function CashFlowReport({
  data,
  groupBy,
  onGroupByChange,
  isLoading = false,
  isError = false,
  onRetry,
}: CashFlowReportProps) {
  const items = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      period: item.period,
      income: parseFloat(item.income) || 0,
      expense: parseFloat(item.expense) || 0,
      net: parseFloat(item.net) || 0,
    }));
  }, [data?.data]);

  if (isError) {
    return (
      <ErrorState
        title="Cash Flow Report Unavailable"
        message="Failed to load cash flow analytics from the server."
        onRetry={onRetry}
      />
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="h-80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-36" />
        </CardHeader>
        <CardContent className="h-60 pt-4">
          <Skeleton className="h-full w-full rounded-[var(--radius-md)]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-[380px] flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
            Cash Flow Analysis
          </CardTitle>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Income vs Expenses and Net Cash Flow over time
          </p>
        </div>

        {/* GroupBy Buttons: Day / Week / Month */}
        <div className="flex items-center gap-1 bg-[var(--surface-secondary)] p-1 rounded-[var(--radius-md)] border border-[var(--border)] self-start sm:self-auto">
          <Button
            variant={groupBy === "day" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onGroupByChange("day")}
            className="text-xs h-7 px-2.5"
          >
            Day
          </Button>
          <Button
            variant={groupBy === "week" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onGroupByChange("week")}
            className="text-xs h-7 px-2.5"
          >
            Week
          </Button>
          <Button
            variant={groupBy === "month" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onGroupByChange("month")}
            className="text-xs h-7 px-2.5"
          >
            Month
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-4 pb-2 px-2 min-h-[260px]">
        {items.length === 0 ? (
          <EmptyState
            title="No cash flow data"
            description="There are no cash flow transactions recorded for this date range."
            className="min-h-[220px]"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tick={XAXIS_TICK}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={YAXIS_TICK}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: unknown) => [formatCurrency(Number(value || 0)), ""]}
              />
              <Legend
                wrapperStyle={LEGEND_WRAPPER_STYLE}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#10B981"
                radius={BAR_RADIUS}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#EF4444"
                radius={BAR_RADIUS}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});
