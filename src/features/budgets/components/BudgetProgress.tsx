import React from "react";
import { BudgetStatus } from "../types";
import { formatCurrency } from "@/utils/formatting/currency";

interface BudgetProgressProps {
  spent: number;
  amount: number;
  percentage: number;
  status: BudgetStatus;
  className?: string;
}

const statusColorMap: Record<BudgetStatus, { bg: string; text: string; fill: string }> = {
  ON_TRACK: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    fill: "bg-emerald-500",
  },
  WARNING: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    fill: "bg-amber-500",
  },
  CRITICAL: {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    fill: "bg-orange-500",
  },
  EXCEEDED: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    fill: "bg-rose-500",
  },
};

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  amount,
  percentage,
  status,
  className = "",
}) => {
  const styles = statusColorMap[status] || statusColorMap.ON_TRACK;
  const clampedWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)] font-medium">
          Spent: {formatCurrency(spent)} of {formatCurrency(amount)}
        </span>
        <span className={`font-semibold ${styles.text}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${styles.fill}`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>
    </div>
  );
};
