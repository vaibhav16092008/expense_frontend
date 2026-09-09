import React from "react";
import { Budget } from "../types";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatting/currency";
import { Wallet, TrendingUp, AlertTriangle, PieChart } from "lucide-react";

interface BudgetSummaryHeaderProps {
  budgets: Budget[];
}

export const BudgetSummaryHeader: React.FC<BudgetSummaryHeaderProps> = ({
  budgets,
}) => {
  const totalBudgeted = budgets.reduce(
    (acc, b) => acc + (Number(b.amount) || 0),
    0
  );
  const totalSpent = budgets.reduce(
    (acc, b) => acc + (Number(b.spent) || 0),
    0
  );
  const totalRemaining = totalBudgeted - totalSpent;
  const overBudgetCount = budgets.filter((b) => b.status === "EXCEEDED").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-[var(--surface)]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Total Budgeted
            </p>
            <p className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
              {formatCurrency(totalBudgeted)}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Across {budgets.length} budget{budgets.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="p-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
            <Wallet className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--surface)]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Total Spent
            </p>
            <p className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {totalBudgeted > 0
                ? `${((totalSpent / totalBudgeted) * 100).toFixed(1)}% of total limit`
                : "No budgets set"}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--surface)]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Remaining Budget
            </p>
            <p
              className={`text-xl font-bold tracking-tight mt-1 ${
                totalRemaining < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Unspent allowance
            </p>
          </div>
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <PieChart className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--surface)]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Exceeded Limits
            </p>
            <p
              className={`text-xl font-bold tracking-tight mt-1 ${
                overBudgetCount > 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {overBudgetCount}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {overBudgetCount > 0
                ? "Budgets over 100% threshold"
                : "All budgets within limit"}
            </p>
          </div>
          <div
            className={`p-3 rounded-full ${
              overBudgetCount > 0
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-gray-500/10 text-gray-500"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
