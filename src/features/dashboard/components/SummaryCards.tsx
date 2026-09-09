"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatting/currency";
import { ArrowDownRight, ArrowUpRight, DollarSign, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { DashboardSummary } from "../types";

interface SummaryCardsProps {
  summary?: DashboardSummary;
  isLoading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading = false }) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Income",
      value: formatCurrency(summary.totalIncome),
      change: summary.incomeChange,
      icon: TrendingUp,
      color: "var(--success)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summary.totalExpenses),
      change: summary.expenseChange,
      icon: TrendingDown,
      color: "var(--danger)",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      title: "Net Savings",
      value: formatCurrency(summary.netSavings),
      change: summary.savingsChange,
      icon: DollarSign,
      color: "var(--primary)",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Savings Rate",
      value: `${summary.savingsRate.toFixed(1)}%`,
      change: undefined,
      icon: PiggyBank,
      color: "var(--warning)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const hasChange = item.change !== undefined;
        const isPositive = (item.change ?? 0) >= 0;

        return (
          <Card key={item.title} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.bgColor, color: item.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {item.value}
              </div>

              {hasChange && (
                <div
                  className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                    isPositive ? "text-success font-semibold" : "text-danger"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {Math.abs(item.change!)}% from last month
                  </span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
