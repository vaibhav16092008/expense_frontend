"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ICON_MAP } from "@/features/categories/components/IconPicker";
import { Transaction } from "@/features/transactions/types";
import { formatCurrency } from "@/utils/formatting/currency";
import { formatDate } from "@/utils/formatting/date";
import { ArrowRight, Tag } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold">Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            No recent transactions found
          </p>
        ) : (
          <div className="divide-y divide-border">
            {transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type === "INCOME";
              const IconComp = tx.category?.icon ? ICON_MAP[tx.category.icon] || Tag : Tag;

              return (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: tx.category?.color || "var(--primary)" }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {tx.merchant || tx.category?.name || "Transaction"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(tx.date)}</p>
                    </div>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span
                      className={`text-xs font-bold ${
                        isIncome ? "text-success font-semibold" : "text-foreground font-semibold"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
