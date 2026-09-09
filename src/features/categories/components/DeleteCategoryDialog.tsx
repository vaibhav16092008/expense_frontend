"use client";

import React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Category } from "../types";

interface DeleteCategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  category,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!category) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Category"
      description={`Are you sure you want to delete "${category.name}"? Transactions associated with this category may be affected.`}
      confirmText="Delete"
      variant="danger"
      isLoading={isLoading}
    />
  );
};
