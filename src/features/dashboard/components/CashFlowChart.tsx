"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatting/currency";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthlyData } from "../types";

interface CashFlowChartProps {
  data: MonthlyData[];
  isLoading?: boolean;
}

const TOOLTIP_CONTENT_STYLE: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const CHART_MARGIN = { top: 10, right: 20, left: -10, bottom: 0 };
const X_AXIS_TICK = { fill: "var(--text-muted)", fontSize: 11 };
const Y_AXIS_TICK = { fill: "var(--text-muted)", fontSize: 11 };

const formatYAxis = (val: unknown) => `$${val}`;
const formatTooltip = (value: unknown) => [formatCurrency(Number(value || 0)), ""] as [string, string];

export const CashFlowChart: React.FC<CashFlowChartProps> = React.memo(function CashFlowChart({
  data,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="h-60">
          <Skeleton className="h-full w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-[340px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold">Income vs Expenses</CardTitle>
          <p className="text-xs text-muted-foreground">Monthly cash flow breakdown</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-muted-foreground font-medium">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="text-muted-foreground font-medium">Expense</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-4 pb-2 px-2 min-h-[240px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
            No chart data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={X_AXIS_TICK}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={Y_AXIS_TICK}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={TOOLTIP_CONTENT_STYLE}
                formatter={formatTooltip}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});
