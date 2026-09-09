"use client";

import React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Transaction } from "../types";
import { formatCurrency } from "@/utils/formatting/currency";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!transaction) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Transaction"
      description={`Are you sure you want to delete this ${transaction.type.toLowerCase()} of ${formatCurrency(
        transaction.amount
      )}${transaction.merchant ? ` at "${transaction.merchant}"` : ""}? This action cannot be undone.`}
      confirmText="Delete"
      variant="danger"
      isLoading={isLoading}
    />
  );
};
