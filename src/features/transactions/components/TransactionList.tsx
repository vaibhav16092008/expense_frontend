"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ICON_MAP } from "@/features/categories/components/IconPicker";
import { formatCurrency } from "@/utils/formatting/currency";
import { formatDate } from "@/utils/formatting/date";
import { Edit2, Eye, PlusCircle, Receipt, Tag, Trash2 } from "lucide-react";
import { Transaction } from "../types";
import { TransactionCard } from "./TransactionCard";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onView: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onCreateNew: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="w-8 h-8 text-muted-foreground" />}
        title="No transactions found"
        description="Add transactions to track your income and spending over time."
        action={
          <Button onClick={onCreateNew} leftIcon={<PlusCircle className="w-4 h-4" />}>
            Add Transaction
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden border border-border rounded-xl bg-surface shadow-xs">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Merchant / Note</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => {
              const isIncome = tx.type === "INCOME";
              const IconComp = tx.category?.icon ? ICON_MAP[tx.category.icon] || Tag : Tag;

              return (
                <tr key={tx.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 text-xs"
                        style={{ backgroundColor: tx.category?.color || "var(--primary)" }}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-foreground">
                        {tx.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    {tx.merchant ? (
                      <span className="font-semibold text-foreground">{tx.merchant}</span>
                    ) : tx.note ? (
                      <span className="text-muted-foreground italic text-xs">{tx.note}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={isIncome ? "success" : "danger"}>{tx.type}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        isIncome ? "text-success font-semibold" : "text-foreground font-semibold"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(tx)}
                        aria-label="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(tx)}
                        aria-label="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(tx)}
                        className="text-danger hover:text-danger hover:bg-danger/10"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {transactions.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} onClick={onView} />
        ))}
      </div>
    </div>
  );
};
