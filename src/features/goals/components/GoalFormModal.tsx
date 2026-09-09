import React, { useState } from "react";
import { Goal } from "../types";
import { useCreateGoal, useUpdateGoal } from "../hooks/useGoals";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/providers/ToastProvider";

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal | null;
}

const GoalFormContent: React.FC<{
  goal?: Goal | null;
  onClose: () => void;
}> = ({ goal, onClose }) => {
  const isEditing = Boolean(goal);
  const toast = useToast();

  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();

  const [name, setName] = useState<string>(goal?.name || "");
  const [targetAmount, setTargetAmount] = useState<string>(goal?.targetAmount || "");
  const [deadline, setDeadline] = useState<string>(
    goal?.deadline ? goal.deadline.split("T")[0] : ""
  );
  const [description, setDescription] = useState<string>(goal?.description || "");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Goal name is required");
      return;
    }

    const parsedTarget = Number(targetAmount);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setFormError("Target amount must be a positive number greater than 0");
      return;
    }

    try {
      if (isEditing && goal) {
        await updateGoalMutation.mutateAsync({
          id: goal.id,
          payload: {
            name: trimmedName,
            targetAmount,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            description: description.trim() || undefined,
          },
        });
        toast.success("Goal updated successfully");
      } else {
        await createGoalMutation.mutateAsync({
          name: trimmedName,
          targetAmount,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
          description: description.trim() || undefined,
        });
        toast.success("Goal created successfully");
      }
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to save goal";
      setFormError(errorMessage);
    }
  };

  const isSubmitting = createGoalMutation.isPending || updateGoalMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {formError && (
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--danger)]/10 text-[var(--danger)] text-xs font-medium">
          {formError}
        </div>
      )}

      <Input
        label="Goal Name"
        placeholder="e.g. Emergency Fund, Car Downpayment, Vacation"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
        required
        maxLength={100}
      />

      <Input
        label="Target Amount ($)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="e.g. 5000.00"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <Input
        label="Target Deadline (Optional)"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        disabled={isSubmitting}
      />

      <Textarea
        label="Description (Optional)"
        placeholder="Why are you saving for this goal? Additional details..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
        rows={3}
        maxLength={500}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEditing ? "Save Changes" : "Create Goal"}
        </Button>
      </div>
    </form>
  );
};

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const isEditing = Boolean(goal);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Goal" : "Create Financial Goal"}
      description={
        isEditing
          ? "Update target amount, deadline, or description."
          : "Set a savings target and deadline for your financial goal. (Current saved balance is updated via Contributions)."
      }
    >
      {isOpen && (
        <GoalFormContent
          key={`${goal?.id || "new"}-${isOpen}`}
          goal={goal}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};
