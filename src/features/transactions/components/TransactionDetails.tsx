"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ICON_MAP } from "@/features/categories/components/IconPicker";
import { formatCurrency } from "@/utils/formatting/currency";
import { formatDate } from "@/utils/formatting/date";
import { Calendar, Edit2, Tag, Trash2, User } from "lucide-react";
import { Transaction } from "../types";

interface TransactionDetailsProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === "INCOME";
  const IconComp = transaction.category?.icon ? ICON_MAP[transaction.category.icon] || Tag : Tag;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="sm">
      <div className="space-y-6 pt-2">
        {/* Amount display */}
        <div className="text-center py-4 bg-muted/40 rounded-xl border border-border">
          <Badge variant={isIncome ? "success" : "danger"} className="mb-2 uppercase tracking-wide">
            {transaction.type}
          </Badge>
          <div
            className={`text-3xl font-extrabold tracking-tight ${
              isIncome ? "text-success font-semibold" : "text-foreground font-semibold"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </span>
            <span className="font-medium text-foreground">{formatDate(transaction.date)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" /> Category
            </span>
            <div className="flex items-center gap-2">
              {transaction.category && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: transaction.category.color || "var(--primary)" }}
                >
                  <IconComp className="w-3 h-3" />
                </div>
              )}
              <span className="font-medium text-foreground">
                {transaction.category?.name || "Uncategorized"}
              </span>
            </div>
          </div>

          {transaction.merchant && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Merchant / Payee
              </span>
              <span className="font-medium text-foreground">{transaction.merchant}</span>
            </div>
          )}

          {transaction.note && (
            <div className="py-2 space-y-1">
              <span className="text-muted-foreground text-xs font-semibold block">Notes</span>
              <p className="p-3 bg-background rounded-lg border border-border text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {transaction.note}
              </p>
            </div>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <Button
            variant="ghost"
            className="text-danger hover:text-danger hover:bg-danger/10"
            onClick={() => {
              onClose();
              onDelete(transaction);
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
