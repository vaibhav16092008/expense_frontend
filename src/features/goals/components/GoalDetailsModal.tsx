import React from "react";
import { Goal } from "../types";
import { useContributions, useDeleteContribution } from "../hooks/useGoals";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GoalProgress } from "./GoalProgress";
import { formatDate } from "@/utils/formatting/date";
import { formatCurrency } from "@/utils/formatting/currency";
import { useToast } from "@/providers/ToastProvider";
import { Calendar, Trash2, History, Target } from "lucide-react";

interface GoalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export const GoalDetailsModal: React.FC<GoalDetailsModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const toast = useToast();
  const goalId = goal?.id || "";

  const { data: contributions = [], isLoading } = useContributions(goalId);
  const deleteContributionMutation = useDeleteContribution();

  if (!goal) return null;

  const currentNum = Number(goal.currentAmount) || 0;
  const targetNum = Number(goal.targetAmount) || 0;

  const handleDeleteContribution = async (contributionId: string) => {
    try {
      await deleteContributionMutation.mutateAsync({
        goalId: goal.id,
        contributionId,
      });
      toast.success("Contribution deleted successfully");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to delete contribution";
      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.name}
      description="Goal overview and contribution history."
      size="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Progress & Summary Cards */}
        <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-secondary)]/50 space-y-4">
          <GoalProgress
            currentAmount={currentNum}
            targetAmount={targetNum}
            progressPercentage={goal.progressPercentage}
            derivedStatus={goal.derivedStatus}
          />

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[var(--text-muted)] block">Target</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {formatCurrency(targetNum)}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Saved</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(currentNum)}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Remaining</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {formatCurrency(Number(goal.remainingAmount) || 0)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]/50">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              Deadline: {goal.deadline ? formatDate(goal.deadline) : "None"}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[var(--primary)]" />
              Status: <Badge variant="neutral" size="sm">{goal.status}</Badge>
            </span>
          </div>
        </div>

        {/* Contribution History Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <History className="w-4 h-4 text-[var(--primary)]" />
            <span>Contribution History ({contributions.length})</span>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-xs text-[var(--text-muted)]">
              Loading contribution history...
            </div>
          ) : contributions.length === 0 ? (
            <div className="p-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
              No contributions recorded yet for this goal.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-secondary)] text-[var(--text-muted)] font-medium sticky top-0">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Amount</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Note</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {contributions.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--surface-secondary)]/30">
                      <td className="p-2.5 text-[var(--text-secondary)] whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="p-2.5 font-semibold text-[var(--text-primary)] whitespace-nowrap">
                        {formatCurrency(Number(c.amount) || 0)}
                      </td>
                      <td className="p-2.5">
                        <Badge variant="neutral" size="sm">
                          {c.type}
                        </Badge>
                      </td>
                      <td className="p-2.5 text-[var(--text-muted)] truncate max-w-xs">
                        {c.note || "—"}
                      </td>
                      <td className="p-2.5 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContribution(c.id)}
                          disabled={deleteContributionMutation.isPending}
                          title="Delete Contribution"
                          aria-label="Delete Contribution"
                          className="h-7 w-7 p-0 text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
