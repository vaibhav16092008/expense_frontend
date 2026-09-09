"use client";

import React from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatting/currency";
import { ArrowRight, PieChart } from "lucide-react";
import { BudgetOverview } from "../types";

interface BudgetOverviewCardProps {
  budget?: BudgetOverview;
  isLoading?: boolean;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  budget,
  isLoading = false,
}) => {
  if (isLoading || !budget) {
    return (
      <Card className="p-5">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card>
    );
  }

  const overallPercentage =
    budget.totalBudgeted > 0
      ? Math.min(100, Math.round((budget.totalSpent / budget.totalBudgeted) * 100))
      : 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <PieChart className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">Budget Progress</CardTitle>
        </div>
        <Link
          href="/budgets"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View Budgets <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Spent: {formatCurrency(budget.totalSpent)}</span>
          <span className="font-bold text-foreground">
            Budgeted: {formatCurrency(budget.totalBudgeted)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              overallPercentage > 90
                ? "bg-danger"
                : overallPercentage > 75
                ? "bg-warning"
                : "bg-primary"
            }`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          <span>{overallPercentage}% of monthly limit</span>
          <span>{formatCurrency(budget.remaining)} remaining</span>
        </div>
      </div>
    </Card>
  );
};
