"use client";

import React from "react";
import { RecurringTransaction } from "../types";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatting/currency";
import { formatDate } from "@/utils/formatting/date";
import { Calendar, Clock, Tag, FileText } from "lucide-react";

export interface RecurringDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recurring: RecurringTransaction | null;
}

export function RecurringDetailsModal({
  isOpen,
  onClose,
  recurring,
}: RecurringDetailsModalProps) {
  if (!recurring) return null;

  const isExpense = recurring.type === "EXPENSE";
  const numAmount = parseFloat(recurring.amount) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recurring Schedule Details"
      description="Complete schedule parameters and execution status"
      size="md"
    >
      <div className="space-y-5 py-2">
        {/* Top Header Card */}
        <div className="p-4 bg-[var(--surface-secondary)]/50 border border-[var(--border)] rounded-[var(--radius-md)] flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              Scheduled Amount
            </span>
            <p
              className={`text-2xl font-bold ${
                isExpense ? "text-[var(--text-primary)]" : "text-[var(--success)]"
              }`}
            >
              {isExpense ? "-" : "+"}
              {formatCurrency(numAmount)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={isExpense ? "danger" : "success"} size="md">
              {recurring.type}
            </Badge>
            <Badge variant={recurring.active ? "success" : "warning"} size="sm">
              {recurring.active ? "ACTIVE" : "PAUSED"}
            </Badge>
          </div>
        </div>

        {/* Schedule Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 mb-1 font-medium">
              <Tag className="w-3.5 h-3.5 text-[var(--primary)]" /> Category
            </span>
            <p className="font-semibold text-sm text-[var(--text-primary)]">
              {recurring.category?.name || "Uncategorized"}
            </p>
          </div>

          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 mb-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" /> Frequency
            </span>
            <p className="font-semibold text-sm text-[var(--text-primary)]">
              {recurring.frequency}
            </p>
          </div>

          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 mb-1 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Start Date
            </span>
            <p className="font-semibold text-sm text-[var(--text-primary)]">
              {formatDate(recurring.startDate)}
            </p>
          </div>

          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 mb-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" /> Server Next Run
            </span>
            <p className="font-semibold text-sm text-[var(--primary)]">
              {formatDate(recurring.nextRunAt)}
            </p>
          </div>

          {recurring.endDate && (
            <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] col-span-2">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5 mb-1 font-medium">
                <Calendar className="w-3.5 h-3.5" /> End Date
              </span>
              <p className="font-semibold text-sm text-[var(--text-primary)]">
                {formatDate(recurring.endDate)}
              </p>
            </div>
          )}
        </div>

        {/* Note if present */}
        {recurring.note && (
          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mb-1 font-medium">
              <FileText className="w-3.5 h-3.5" /> Note
            </span>
            <p className="text-xs text-[var(--text-primary)] whitespace-pre-wrap">
              {recurring.note}
            </p>
          </div>
        )}

        {/* Meta Timestamps */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>Created: {formatDate(recurring.createdAt)}</span>
          <span>Last Updated: {formatDate(recurring.updatedAt)}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
