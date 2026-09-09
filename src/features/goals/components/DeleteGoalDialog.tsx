import React from "react";
import { Goal } from "../types";
import { useDeleteGoal } from "../hooks/useGoals";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/providers/ToastProvider";

interface DeleteGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export const DeleteGoalDialog: React.FC<DeleteGoalDialogProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const toast = useToast();
  const deleteGoalMutation = useDeleteGoal();

  if (!goal) return null;

  const handleDelete = async () => {
    try {
      await deleteGoalMutation.mutateAsync(goal.id);
      toast.success("Goal deleted successfully");
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to delete goal";
      toast.error(errorMessage);
    }
  };

  const isDeleting = deleteGoalMutation.isPending;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Financial Goal"
      description={`Are you sure you want to delete "${goal.name}"? Recorded contributions associated with this goal will also be removed.`}
      confirmText="Delete Goal"
      variant="danger"
      isLoading={isDeleting}
    />
  );
};
