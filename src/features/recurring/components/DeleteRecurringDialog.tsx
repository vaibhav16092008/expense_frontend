"use client";

import React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { RecurringTransaction } from "../types";

export interface DeleteRecurringDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recurring: RecurringTransaction | null;
  isLoading?: boolean;
}

export function DeleteRecurringDialog({
  isOpen,
  onClose,
  onConfirm,
  recurring,
  isLoading = false,
}: DeleteRecurringDialogProps) {
  if (!recurring) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Recurring Schedule?"
      description={`Are you sure you want to delete this ${recurring.frequency.toLowerCase()} ${recurring.type.toLowerCase()} schedule of $${recurring.amount}? Deleting this recurring schedule will stop all future automatic runs, but it will NOT delete any previously generated transactions.`}
      confirmText="Delete Schedule"
      cancelText="Cancel"
      variant="danger"
      isLoading={isLoading}
    />
  );
}
