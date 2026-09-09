import React, { useState } from "react";
import { Goal, ContributionType } from "../types";
import { useAddContribution } from "../hooks/useGoals";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/providers/ToastProvider";

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const toast = useToast();
  const addContributionMutation = useAddContribution();

  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<ContributionType>("MANUAL");
  const [formError, setFormError] = useState<string | null>(null);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Contribution amount must be a positive number greater than 0");
      return;
    }

    try {
      const res = await addContributionMutation.mutateAsync({
        goalId: goal.id,
        payload: {
          amount,
          note: note.trim() || undefined,
          type,
        },
      });

      if (res?.goal?.status === "COMPLETED" && goal.status !== "COMPLETED") {
        toast.success(
          "Goal Completed! 🎉",
          `Your contribution brought "${goal.name}" to 100% target completion!`
        );
      } else {
        toast.success("Contribution added successfully");
      }

      setAmount("");
      setNote("");
      setType("MANUAL");
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to add contribution";
      setFormError(errorMessage);
    }
  };

  const isSubmitting = addContributionMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Contribution for "${goal.name}"`}
      description="Record a savings deposit or adjustment towards this goal."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {formError && (
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--danger)]/10 text-[var(--danger)] text-xs font-medium">
            {formError}
          </div>
        )}

        <Input
          label="Contribution Amount ($)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="e.g. 150.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
          required
          autoFocus
        />

        <Select
          label="Contribution Type"
          value={type}
          onChange={(e) => setType(e.target.value as ContributionType)}
          disabled={isSubmitting}
          options={[
            { value: "MANUAL", label: "Manual Deposit" },
            { value: "ADJUSTMENT", label: "Balance Adjustment" },
          ]}
        />

        <Textarea
          label="Note (Optional)"
          placeholder="e.g. Monthly transfer, bonus savings..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isSubmitting}
          rows={2}
          maxLength={250}
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
            Add Contribution
          </Button>
        </div>
      </form>
    </Modal>
  );
};
