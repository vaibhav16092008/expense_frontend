import React from "react";
import { DerivedStatus } from "../types";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatting/currency";

interface GoalProgressProps {
  currentAmount: number;
  targetAmount: number;
  progressPercentage: number;
  derivedStatus: DerivedStatus;
  className?: string;
}

const statusBadgeMap: Record<DerivedStatus, { variant: "success" | "warning" | "danger" | "info" | "neutral" | "primary"; label: string }> = {
  COMPLETED: { variant: "success", label: "Completed" },
  ON_TRACK: { variant: "success", label: "On Track" },
  AT_RISK: { variant: "warning", label: "At Risk" },
  PAUSED: { variant: "neutral", label: "Paused" },
  OVERDUE: { variant: "danger", label: "Overdue" },
  NOT_STARTED: { variant: "neutral", label: "Not Started" },
};

const statusFillMap: Record<DerivedStatus, string> = {
  COMPLETED: "bg-emerald-500",
  ON_TRACK: "bg-emerald-500",
  AT_RISK: "bg-amber-500",
  PAUSED: "bg-gray-400 dark:bg-gray-600",
  OVERDUE: "bg-rose-500",
  NOT_STARTED: "bg-blue-500",
};

export const GoalProgress: React.FC<GoalProgressProps> = ({
  currentAmount,
  targetAmount,
  progressPercentage,
  derivedStatus,
  className = "",
}) => {
  const badgeConfig = statusBadgeMap[derivedStatus] || { variant: "neutral", label: derivedStatus };
  const fillClass = statusFillMap[derivedStatus] || "bg-[var(--primary)]";
  const clampedWidth = Math.min(Math.max(progressPercentage, 0), 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)] font-medium">
          {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-primary)]">
            {progressPercentage.toFixed(1)}%
          </span>
          <Badge variant={badgeConfig.variant} size="sm">
            {badgeConfig.label}
          </Badge>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${fillClass}`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>
    </div>
  );
};
