"use client";

import React from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatting/currency";
import { ArrowRight, Target } from "lucide-react";
import { GoalSummary } from "../types";

interface GoalsSummaryCardProps {
  goals?: GoalSummary;
  isLoading?: boolean;
}

export const GoalsSummaryCard: React.FC<GoalsSummaryCardProps> = ({
  goals,
  isLoading = false,
}) => {
  if (isLoading || !goals) {
    return (
      <Card className="p-5">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card>
    );
  }

  const progress = Math.min(100, Math.round(goals.overallProgress || 0));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Target className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">Savings Goals</CardTitle>
        </div>
        <Link
          href="/goals"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View Goals <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Saved: {formatCurrency(goals.totalCurrent)}
          </span>
          <span className="font-bold text-foreground">
            Target: {formatCurrency(goals.totalTarget)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          <span>{goals.totalGoals} Active Goal{goals.totalGoals === 1 ? "" : "s"}</span>
          <span>{progress}% Total Saved</span>
        </div>
      </div>
    </Card>
  );
};
