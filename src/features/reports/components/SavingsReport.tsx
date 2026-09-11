"use client";

import React from "react";
import { ReportGroupBy, SavingsReportData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
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
import { PiggyBank } from "lucide-react";

export interface SavingsReportProps {
  data?: SavingsReportData;
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
const CHART_MARGIN = { top: 10, right: 20, left: 0, bottom: 0 };
const XAXIS_TICK = { fill: "var(--text-muted)", fontSize: 11 };
const YAXIS_TICK = { fill: "var(--text-muted)", fontSize: 11 };
const formatYAxis = (val: number | string) => `$${val}`;

export const SavingsReport = React.memo(function SavingsReport({
  data,
  groupBy,
  onGroupByChange,
  isLoading = false,
  isError = false,
  onRetry,
}: SavingsReportProps) {
  const chartData = React.useMemo(() => {
    if (!data?.breakdown) return [];
    return data.breakdown.map((item) => ({
      period: item.period,
      savings: parseFloat(item.savings) || 0,
    }));
  }, [data?.breakdown]);

  const numSavings = React.useMemo(() => {
    return parseFloat(data?.totalSavings || "0") || 0;
  }, [data?.totalSavings]);

  if (isError) {
    return (
      <ErrorState
        title="Savings Report Unavailable"
        message="Failed to load savings analytics from the server."
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
            <PiggyBank className="w-5 h-5 text-[var(--primary)]" />
            Savings Analysis & Trajectory
          </CardTitle>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Total Savings:{" "}
            <strong className="text-[var(--primary)]">
              {formatCurrency(numSavings)}
            </strong>{" "}
            (Savings Rate: <strong>{data.savingsRate.toFixed(1)}%</strong>)
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
        {chartData.length === 0 ? (
          <EmptyState
            title="No savings data"
            description="There are no savings records logged in this date range."
            className="min-h-[220px]"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                formatter={(value: unknown) => [formatCurrency(Number(value || 0)), "Savings"]}
              />
              <Area
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#savingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});
