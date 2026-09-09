import React from "react";
import { Budget } from "../types";
import { useDeleteBudget } from "../hooks/useBudgets";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/providers/ToastProvider";

interface DeleteBudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
}

export const DeleteBudgetDialog: React.FC<DeleteBudgetDialogProps> = ({
  isOpen,
  onClose,
  budget,
}) => {
  const toast = useToast();
  const deleteBudgetMutation = useDeleteBudget();

  if (!budget) return null;

  const handleDelete = async () => {
    try {
      await deleteBudgetMutation.mutateAsync(budget.id);
      toast.success("Budget deleted successfully");
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to delete budget";
      toast.error(errorMessage);
    }
  };

  const isDeleting = deleteBudgetMutation.isPending;
  const titleName = budget.category ? budget.category.name : "Overall Budget";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Budget"
      description={`Are you sure you want to delete the budget for "${titleName}"? Expenses will remain unaffected in your financial history.`}
      confirmText="Delete Budget"
      variant="danger"
      isLoading={isDeleting}
    />
  );
};
