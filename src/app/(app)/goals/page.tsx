"use client";

import React, { useState } from "react";
import {
  Goal,
  GoalFilters,
  GoalSummaryHeader,
  GoalList,
  GoalFormModal,
  AddContributionModal,
  GoalDetailsModal,
  DeleteGoalDialog,
  useGoalSummary,
  usePauseGoal,
  useResumeGoal,
  useCompleteGoal,
} from "@/features/goals";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Plus, Target } from "lucide-react";

export default function GoalsPage() {
  const toast = useToast();

  const [filters, setFilters] = useState<GoalFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<Goal | null>(null);
  const [goalForContribution, setGoalForContribution] = useState<Goal | null>(null);
  const [goalForDetails, setGoalForDetails] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  const { data: summary, isLoading: isLoadingSummary } = useGoalSummary();

  const pauseGoalMutation = usePauseGoal();
  const resumeGoalMutation = useResumeGoal();
  const completeGoalMutation = useCompleteGoal();

  const handleCreateNew = () => {
    setSelectedGoalForEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (goal: Goal) => {
    setSelectedGoalForEdit(goal);
    setIsFormOpen(true);
  };

  const handleAddContribution = (goal: Goal) => {
    setGoalForContribution(goal);
  };

  const handleViewDetails = (goal: Goal) => {
    setGoalForDetails(goal);
  };

  const handleDelete = (goal: Goal) => {
    setGoalToDelete(goal);
  };

  const handlePause = async (goalId: string) => {
    try {
      await pauseGoalMutation.mutateAsync(goalId);
      toast.info("Goal paused");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to pause goal";
      toast.error(errorMessage);
    }
  };

  const handleResume = async (goalId: string) => {
    try {
      await resumeGoalMutation.mutateAsync(goalId);
      toast.success("Goal resumed");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to resume goal";
      toast.error(errorMessage);
    }
  };

  const handleComplete = async (goalId: string) => {
    try {
      await completeGoalMutation.mutateAsync(goalId);
      toast.success("Goal marked as completed! 🎉");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to complete goal";
      toast.error(errorMessage);
    }
  };

  const isActionPending =
    pauseGoalMutation.isPending ||
    resumeGoalMutation.isPending ||
    completeGoalMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Target className="w-6 h-6 text-[var(--primary)]" />
            Financial Goals
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Track your long-term savings goals, log contributions, and manage progress.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleCreateNew}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Goal
        </Button>
      </div>

      {/* Goal Summary KPI Header */}
      <GoalSummaryHeader summary={summary} isLoading={isLoadingSummary} />

      {/* Main Goal List Grid */}
      <GoalList
        filters={filters}
        onFilterChange={setFilters}
        onAddContribution={handleAddContribution}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPause={handlePause}
        onResume={handleResume}
        onComplete={handleComplete}
        onCreateNew={handleCreateNew}
        isActionPending={isActionPending}
      />

      {/* Create / Edit Goal Modal */}
      <GoalFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        goal={selectedGoalForEdit}
      />

      {/* Add Contribution Modal */}
      <AddContributionModal
        isOpen={Boolean(goalForContribution)}
        onClose={() => setGoalForContribution(null)}
        goal={goalForContribution}
      />

      {/* Goal Details & Contribution History Modal */}
      <GoalDetailsModal
        isOpen={Boolean(goalForDetails)}
        onClose={() => setGoalForDetails(null)}
        goal={goalForDetails}
      />

      {/* Delete Goal Dialog */}
      <DeleteGoalDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        goal={goalToDelete}
      />
    </div>
  );
}
