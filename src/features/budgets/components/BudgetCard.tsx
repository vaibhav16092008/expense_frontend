import React from "react";
import { Budget } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BudgetProgress } from "./BudgetProgress";
import { formatDate } from "@/utils/formatting/date";
import { formatCurrency } from "@/utils/formatting/currency";
import { Calendar, Edit2, Trash2, PieChart, Tag } from "lucide-react";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

const statusBadgeVariantMap: Record<Budget["status"], "success" | "warning" | "danger" | "info"> = {
  ON_TRACK: "success",
  WARNING: "warning",
  CRITICAL: "warning",
  EXCEEDED: "danger",
};

const statusLabelMap: Record<Budget["status"], string> = {
  ON_TRACK: "On Track",
  WARNING: "Warning (70%+)",
  CRITICAL: "Critical (90%+)",
  EXCEEDED: "Exceeded (100%+)",
};

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
}) => {
  const spentNum = Number(budget.spent) || 0;
  const amountNum = Number(budget.amount) || 0;
  const remainingNum = Number(budget.remaining) || 0;

  const isCategory = budget.type === "CATEGORY" && budget.category;
  const title = isCategory ? budget.category?.name : "Overall Spending Budget";

  return (
    <Card className="hover:border-[var(--primary)]/30 transition-all duration-200 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
              {isCategory ? <Tag className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold truncate text-[var(--text-primary)]">
                {title}
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="neutral" size="sm">
                  {budget.period}
                </Badge>
                {budget.isActive ? (
                  <Badge variant="success" size="sm">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(budget)}
              title="Edit Budget"
              aria-label="Edit Budget"
              className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(budget)}
              title="Delete Budget"
              aria-label="Delete Budget"
              className="h-8 w-8 p-0 text-[var(--danger)] hover:bg-[var(--danger)]/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <BudgetProgress
          spent={spentNum}
          amount={amountNum}
          percentage={budget.percentage}
          status={budget.status}
        />

        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/50 text-xs">
          <div>
            <span className="text-[var(--text-muted)] block">Remaining</span>
            <span
              className={`font-semibold ${
                remainingNum < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {formatCurrency(remainingNum)}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block">Status</span>
            <Badge variant={statusBadgeVariantMap[budget.status]} size="sm">
              {statusLabelMap[budget.status]}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>
            {formatDate(budget.startDate)} – {formatDate(budget.endDate)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
