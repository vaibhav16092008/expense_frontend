"use client";

import React from "react";
import { BudgetReportData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/formatting/currency";
import { Target, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export interface BudgetReportProps {
  data?: BudgetReportData;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function BudgetReport({
  data,
  isLoading = false,
  isError = false,
  onRetry,
}: BudgetReportProps) {
  if (isError) {
    return (
      <ErrorState
        title="Budget Report Unavailable"
        message="Failed to load budget performance analytics from the server."
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

  const getStatusBadge = (status: "ON_TRACK" | "WARNING" | "EXCEEDED") => {
    switch (status) {
      case "ON_TRACK":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
            ON TRACK
          </Badge>
        );
      case "WARNING":
        return (
          <Badge variant="warning" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1 inline" />
            NEAR LIMIT
          </Badge>
        );
      case "EXCEEDED":
        return (
          <Badge variant="danger" size="sm">
            <AlertCircle className="w-3 h-3 mr-1 inline" />
            EXCEEDED
          </Badge>
        );
    }
  };

  return (
    <Card className="h-full min-h-[340px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--primary)]" />
            Budget Performance
          </CardTitle>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Active budgets overlapping with selected date range ({data.totalBudgets} total)
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        {data.budgets.length === 0 ? (
          <EmptyState
            title="No budget performance data"
            description="There are no active budgets overlapping with the selected date range."
            className="min-h-[200px]"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.budgets.map((b) => {
              const numAmount = parseFloat(b.amount) || 0;
              const numSpent = parseFloat(b.spent) || 0;
              const numRemaining = parseFloat(b.remaining) || 0;
              const pct = Math.min(100, Math.max(0, b.percentageUsed));

              const isExceeded = b.status === "EXCEEDED";
              const isWarning = b.status === "WARNING";

              return (
                <div
                  key={b.budgetId}
                  className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                        {b.name}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] font-medium">
                        {b.type} • {b.period}
                      </p>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[var(--text-secondary)]">
                        Spent: {formatCurrency(numSpent)} of {formatCurrency(numAmount)}
                      </span>
                      <span
                        className={
                          isExceeded
                            ? "text-[var(--danger)] font-bold"
                            : isWarning
                            ? "text-[var(--warning)] font-bold"
                            : "text-[var(--primary)] font-semibold"
                        }
                      >
                        {b.percentageUsed.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExceeded
                            ? "bg-[var(--danger)]"
                            : isWarning
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--primary)]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-[var(--text-muted)] pt-1">
                    <span>
                      Remaining:{" "}
                      <strong
                        className={
                          numRemaining < 0
                            ? "text-[var(--danger)]"
                            : "text-[var(--text-primary)]"
                        }
                      >
                        {formatCurrency(numRemaining)}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
