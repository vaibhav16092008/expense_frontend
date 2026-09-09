import React from "react";
import { Goal } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GoalProgress } from "./GoalProgress";
import { formatDate } from "@/utils/formatting/date";
import { formatCurrency } from "@/utils/formatting/currency";
import {
  Target,
  PlusCircle,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onAddContribution: (goal: Goal) => void;
  onViewDetails: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onPause: (goalId: string) => void;
  onResume: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  isActionPending?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onAddContribution,
  onViewDetails,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onComplete,
  isActionPending = false,
}) => {
  const currentNum = Number(goal.currentAmount) || 0;
  const targetNum = Number(goal.targetAmount) || 0;
  const remainingNum = Number(goal.remainingAmount) || 0;

  return (
    <Card className="hover:border-[var(--primary)]/30 transition-all duration-200 shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold truncate text-[var(--text-primary)]">
                  {goal.name}
                </CardTitle>
                {goal.description && (
                  <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5 max-w-xs">
                    {goal.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(goal)}
                title="View Details & Contributions"
                aria-label="View Details"
                className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(goal)}
                title="Edit Goal"
                aria-label="Edit Goal"
                className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(goal)}
                title="Delete Goal"
                aria-label="Delete Goal"
                className="h-8 w-8 p-0 text-[var(--danger)] hover:bg-[var(--danger)]/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <GoalProgress
            currentAmount={currentNum}
            targetAmount={targetNum}
            progressPercentage={goal.progressPercentage}
            derivedStatus={goal.derivedStatus}
          />

          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/50 text-xs">
            <div>
              <span className="text-[var(--text-muted)] block">Remaining</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {formatCurrency(remainingNum)}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Deadline</span>
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                {goal.deadline ? formatDate(goal.deadline) : "No deadline"}
              </span>
            </div>
          </div>

          {goal.daysRemaining !== null && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                {goal.daysRemaining < 0
                  ? `Deadline passed ${Math.abs(goal.daysRemaining)} days ago`
                  : goal.daysRemaining === 0
                  ? "Deadline is today"
                  : `${goal.daysRemaining} days remaining`}
              </span>
            </div>
          )}
        </CardContent>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)]/50 mt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAddContribution(goal)}
          disabled={goal.status === "COMPLETED" || goal.status === "PAUSED" || isActionPending}
          leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
        >
          Contribute
        </Button>

        <div className="flex items-center gap-1">
          {goal.status === "ACTIVE" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPause(goal.id)}
              disabled={isActionPending}
              title="Pause Goal"
              leftIcon={<PauseCircle className="w-3.5 h-3.5 text-amber-500" />}
            >
              Pause
            </Button>
          )}

          {goal.status === "PAUSED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResume(goal.id)}
              disabled={isActionPending}
              title="Resume Goal"
              leftIcon={<PlayCircle className="w-3.5 h-3.5 text-emerald-500" />}
            >
              Resume
            </Button>
          )}

          {goal.status !== "COMPLETED" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComplete(goal.id)}
              disabled={isActionPending}
              title="Mark as Completed"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
