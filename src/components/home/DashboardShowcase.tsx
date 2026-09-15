import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  PieChart,
  Target,
  ArrowRight,
  DollarSign,
} from "lucide-react";

export function DashboardShowcase() {
  const categories = [
    { name: "Housing", amount: "$1,650.00", percentage: 38, color: "bg-[var(--primary)]" },
    { name: "Groceries & Food", amount: "$680.50", percentage: 24, color: "bg-[var(--info)]" },
    { name: "Transportation", amount: "$420.00", percentage: 15, color: "bg-[var(--warning)]" },
    { name: "Utilities", amount: "$310.00", percentage: 11, color: "bg-purple-500" },
    { name: "Entertainment & Misc", amount: "$340.00", percentage: 12, color: "bg-pink-500" },
  ];

  return (
    <section id="insights" className="py-20 md:py-28 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] block">
            Visual Analytics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            See your financial picture at a glance.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            ExpenseIQ synthesizes incoming and outgoing transactions into crystal-clear cash flow
            trends, category allocations, and budget alerts.
          </p>
        </div>

        {/* Dashboard Mockup Display Card */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-[var(--shadow-lg)]">
          {/* Top Bar with Demo Disclaimers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-subtle)] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Personal Financial Summary
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Simulated preview with demo data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)] bg-[var(--surface-secondary)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
                Current Cycle: September 2026
              </span>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/60 border border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--text-muted)] font-medium block mb-1">
                Net Balance
              </span>
              <div className="flex items-baseline gap-1 text-xl font-extrabold text-[var(--text-primary)]">
                <DollarSign className="w-4 h-4 text-[var(--text-muted)] -mr-0.5" />
                <span>8,450.20</span>
              </div>
              <span className="text-[11px] text-[var(--success)] font-semibold mt-1 block">
                +14.2% from last month
              </span>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/60 border border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--text-muted)] font-medium block mb-1">
                Monthly Income
              </span>
              <div className="flex items-baseline gap-1 text-xl font-extrabold text-[var(--success)]">
                <ArrowUpRight className="w-4 h-4" />
                <span>$6,800.00</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                2 recurring deposits
              </span>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/60 border border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--text-muted)] font-medium block mb-1">
                Monthly Expenses
              </span>
              <div className="flex items-baseline gap-1 text-xl font-extrabold text-[var(--danger)]">
                <ArrowDownRight className="w-4 h-4" />
                <span>$3,400.50</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                24 logged transactions
              </span>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/60 border border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--text-muted)] font-medium block mb-1">
                Savings Target
              </span>
              <div className="flex items-baseline gap-1 text-xl font-extrabold text-[var(--primary)]">
                <TrendingUp className="w-4 h-4" />
                <span>50.0%</span>
              </div>
              <span className="text-[11px] text-[var(--success)] font-semibold mt-1 block">
                Target achieved
              </span>
            </div>
          </div>

          {/* Lower Grid: Category Spending Breakdown & Budgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Category Breakdown */}
            <div className="lg:col-span-7 p-5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[var(--primary)]" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Spending by Category
                  </h4>
                </div>
                <span className="text-xs text-[var(--text-muted)]">5 Active Categories</span>
              </div>

              {/* Combined allocation progress bar */}
              <div className="h-3 w-full rounded-full bg-[var(--border)] overflow-hidden flex mb-5">
                {categories.map((c, i) => (
                  <div
                    key={i}
                    style={{ width: `${c.percentage}%` }}
                    className={`h-full ${c.color}`}
                    title={`${c.name}: ${c.percentage}%`}
                  />
                ))}
              </div>

              {/* Category List */}
              <div className="space-y-2.5">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                      <span className="text-[var(--text-secondary)] font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-muted)]">{cat.percentage}%</span>
                      <span className="text-[var(--text-primary)] font-semibold w-16 text-right">
                        {cat.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budgets & Goals Preview */}
            <div className="lg:col-span-5 p-5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-[var(--info)]" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Budget & Goal Progress
                  </h4>
                </div>

                {/* Budget 1 */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Living Essentials</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      $1,960 / $2,200 (89%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="w-[89%] h-full bg-[var(--primary)] rounded-full" />
                  </div>
                </div>

                {/* Budget 2 */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Entertainment & Dining</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      $450 / $600 (75%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-[var(--info)] rounded-full" />
                  </div>
                </div>

                {/* Goal 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Vacation Fund Goal</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      $2,400 / $3,000 (80%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="w-[80%] h-full bg-[var(--warning)] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Action Callout */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <Link href="/dashboard" className="block w-full">
                  <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Your Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
