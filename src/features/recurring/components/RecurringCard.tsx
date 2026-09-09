"use client";

import React from "react";
import { RecurringTransaction } from "../types";
import { Badge } from "@/components/ui/Badge";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatting/currency";
import { formatDate } from "@/utils/formatting/date";
import {
  MoreVertical,
  Play,
  Pause,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export interface RecurringCardProps {
  recurring: RecurringTransaction;
  onEdit: (recurring: RecurringTransaction) => void;
  onDelete: (recurring: RecurringTransaction) => void;
  onDetails: (recurring: RecurringTransaction) => void;
  onPause: (recurring: RecurringTransaction) => void;
  onResume: (recurring: RecurringTransaction) => void;
  isActionLoading?: boolean;
}

export function RecurringCard({
  recurring,
  onEdit,
  onDelete,
  onDetails,
  onPause,
  onResume,
  isActionLoading = false,
}: RecurringCardProps) {
  const isExpense = recurring.type === "EXPENSE";
  const numAmount = parseFloat(recurring.amount) || 0;

  return (
    <div className="group relative p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col justify-between">
      {/* Top Bar: Badges + Action Menu */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* EXPENSE / INCOME Badge */}
            <Badge variant={isExpense ? "danger" : "success"} size="sm">
              <span className="flex items-center gap-1">
                {isExpense ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownLeft className="w-3 h-3" />
                )}
                {recurring.type}
              </span>
            </Badge>

            {/* Frequency Badge */}
            <Badge variant="neutral" size="sm">
              {recurring.frequency}
            </Badge>

            {/* Active / Paused Badge */}
            <Badge variant={recurring.active ? "success" : "warning"} size="sm">
              {recurring.active ? "ACTIVE" : "PAUSED"}
            </Badge>
          </div>

          {/* Action Menu */}
          <Dropdown
            align="right"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Actions menu"
                disabled={isActionLoading}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            }
          >
            <DropdownItem onClick={() => onDetails(recurring)}>
              <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
              View Details
            </DropdownItem>

            {recurring.active ? (
              <DropdownItem onClick={() => onPause(recurring)}>
                <Pause className="w-4 h-4 text-[var(--warning)]" />
                Pause Schedule
              </DropdownItem>
            ) : (
              <DropdownItem onClick={() => onResume(recurring)}>
                <Play className="w-4 h-4 text-[var(--success)]" />
                Resume Schedule
              </DropdownItem>
            )}

            <DropdownItem onClick={() => onEdit(recurring)}>
              <Edit2 className="w-4 h-4 text-[var(--text-secondary)]" />
              Edit Schedule
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem danger onClick={() => onDelete(recurring)}>
              <Trash2 className="w-4 h-4" />
              Delete Schedule
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Amount & Category */}
        <div className="mb-4">
          <p
            className={`text-2xl font-bold ${
              isExpense ? "text-[var(--text-primary)]" : "text-[var(--success)]"
            }`}
          >
            {isExpense ? "-" : "+"}
            {formatCurrency(numAmount)}
          </p>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-secondary)] font-medium">
            <Tag className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span className="truncate">{recurring.category?.name || "Uncategorized"}</span>
          </div>

          {recurring.note && (
            <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2 italic">
              &quot;{recurring.note}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Schedule Timestamps */}
      <div className="pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1.5 bg-[var(--surface-secondary)]/30 -mx-5 -mb-5 p-4 rounded-b-[var(--radius-lg)]">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-[var(--text-muted)]">
            <Calendar className="w-3.5 h-3.5" /> Start Date
          </span>
          <span className="font-medium text-[var(--text-primary)]">
            {formatDate(recurring.startDate)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-[var(--text-muted)]">
            <Clock className="w-3.5 h-3.5 text-[var(--primary)]" /> Next Run
          </span>
          <span className="font-semibold text-[var(--primary)]">
            {formatDate(recurring.nextRunAt)}
          </span>
        </div>

        {recurring.endDate && (
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-[var(--text-muted)]">
              <Calendar className="w-3.5 h-3.5" /> End Date
            </span>
            <span className="font-medium text-[var(--text-primary)]">
              {formatDate(recurring.endDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
