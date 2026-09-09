"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { ICON_MAP } from "@/features/categories/components/IconPicker";
import { formatCurrency } from "@/utils/formatting/currency";
import { formatDate } from "@/utils/formatting/date";
import { Tag } from "lucide-react";
import { Transaction } from "../types";

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (tx: Transaction) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
  const isIncome = transaction.type === "INCOME";
  const IconComp = transaction.category?.icon ? ICON_MAP[transaction.category.icon] || Tag : Tag;

  return (
    <div
      onClick={() => onClick(transaction)}
      className="p-4 border border-border rounded-xl bg-surface hover:border-primary/50 transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
          style={{ backgroundColor: transaction.category?.color || "var(--primary)" }}
        >
          <IconComp className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm truncate">
              {transaction.merchant || transaction.category?.name || "Transaction"}
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
            <span>{formatDate(transaction.date)}</span>
            {transaction.merchant && transaction.category && (
              <>
                <span>•</span>
                <span className="truncate">{transaction.category.name}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span
          className={`text-sm font-bold block ${
            isIncome ? "text-success font-semibold" : "text-foreground font-semibold"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
        <Badge variant={isIncome ? "success" : "danger"} size="sm" className="mt-0.5">
          {transaction.type}
        </Badge>
      </div>
    </div>
  );
};
