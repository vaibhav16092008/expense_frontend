import React from "react";
import { GoalSummary } from "../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatting/currency";
import { Target, CheckCircle2, PauseCircle, AlertCircle, Award } from "lucide-react";

interface GoalSummaryHeaderProps {
  summary?: GoalSummary | null;
  isLoading?: boolean;
}

export const GoalSummaryHeader: React.FC<GoalSummaryHeaderProps> = ({
  summary,
  isLoading = false,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const targetNum = Number(summary.totalTargetAmount) || 0;
  const currentNum = Number(summary.totalCurrentAmount) || 0;
  const remainingNum = Number(summary.totalRemainingAmount) || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Total Target Saved
              </p>
              <p className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                {formatCurrency(currentNum)}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Target: {formatCurrency(targetNum)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <Target className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Overall Progress
              </p>
              <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                {summary.overallProgressPercentage.toFixed(1)}%
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Remaining: {formatCurrency(remainingNum)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Active / Paused
              </p>
              <p className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                {summary.activeGoals} <span className="text-sm font-normal text-[var(--text-muted)]">active</span> / {summary.pausedGoals} <span className="text-sm font-normal text-[var(--text-muted)]">paused</span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {summary.completedGoals} completed
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <PauseCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Overdue Goals
              </p>
              <p
                className={`text-xl font-bold tracking-tight mt-1 ${
                  summary.overdueGoals > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-[var(--text-primary)]"
                }`}
              >
                {summary.overdueGoals}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {summary.topGoal
                  ? `Top: ${summary.topGoal.name} (${summary.topGoal.progressPercentage.toFixed(0)}%)`
                  : "No active top goal"}
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                summary.overdueGoals > 0
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {summary.overdueGoals > 0 ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Award className="w-5 h-5" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
