import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Target,
  Sparkles,
} from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-secondary)]/50 via-[var(--background)] to-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-xs font-semibold tracking-wide uppercase border border-[var(--primary)]/20 shadow-[var(--shadow-sm)]">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Personal Finance, Simplified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
              Know where your money goes.{" "}
              <span className="text-[var(--primary)] block sm:inline">
                Plan where it should go.
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              ExpenseIQ brings expenses, budgets, goals, recurring payments, and financial
              insights into one simple, offline-first dashboard.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started Free
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Value Highlights Mini-List */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                Full offline capability
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                Private & account-isolated
              </span>
            </div>
          </div>

          {/* Right Column: Static Dashboard Visual Preview */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)] transition-all">
              {/* Header Preview Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">
                      Monthly Overview
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Fictional Demo Data</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] border border-[var(--primary)]/20">
                  Live Preview
                </span>
              </div>

              {/* Net Balance & Flow Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block mb-1">Total Income</span>
                  <div className="flex items-center gap-1 text-[var(--success)] font-bold text-base">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>$5,420.00</span>
                  </div>
                </div>

                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block mb-1">Total Expenses</span>
                  <div className="flex items-center gap-1 text-[var(--danger)] font-bold text-base">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>$2,180.50</span>
                  </div>
                </div>
              </div>

              {/* Net Savings & Cashflow Mini-Graph Representation */}
              <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]/70 border border-[var(--border-subtle)] mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[var(--text-secondary)] font-medium">Net Savings Rate</span>
                  <span className="text-[var(--primary)] font-bold">59.8%</span>
                </div>
                {/* Horizontal Segmented Bar */}
                <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[var(--primary)] w-[60%]" title="Savings" />
                  <div className="h-full bg-[var(--info)] w-[25%]" title="Fixed Expenses" />
                  <div className="h-full bg-[var(--warning)] w-[15%]" title="Discretionary" />
                </div>
              </div>

              {/* Budget Progress Mock */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                    <PieChart className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Dining & Groceries Budget</span>
                  </div>
                  <span className="text-[var(--text-primary)] font-semibold">$540 / $700</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="w-[77%] h-full bg-[var(--primary)] rounded-full" />
                </div>

                {/* Savings Goal Mock */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                    <Target className="w-3.5 h-3.5 text-[var(--info)]" />
                    <span>Emergency Fund Goal</span>
                  </div>
                  <span className="text-[var(--text-primary)] font-semibold">$8,200 / $10,000</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="w-[82%] h-full bg-[var(--info)] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
