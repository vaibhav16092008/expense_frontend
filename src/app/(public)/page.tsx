import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TrendingUp, ArrowRight, ShieldCheck, Zap, BarChart2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header Navigation */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--primary)] text-white flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Expense<span className="text-[var(--primary)]">IQ</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-xs font-semibold mb-6 border border-[var(--primary)]/20">
          <Zap className="w-3.5 h-3.5" />
          Next-Gen Personal Finance Engine
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Master your wealth with <span className="text-[var(--primary)]">ExpenseIQ</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mb-8 leading-relaxed">
          Intelligent expense tracking, automated budget allocation, and real-time financial insights engineered for modern professionals.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Dashboard
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Sign In to Account
            </Button>
          </Link>
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="p-2.5 bg-[var(--primary-muted)] text-[var(--primary)] rounded-md w-fit mb-3">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Data-Driven Insights</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Categorize transactions, monitor recurring bills, and forecast cash flow effortlessly.
            </p>
          </div>

          <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="p-2.5 bg-[var(--primary-muted)] text-[var(--primary)] rounded-md w-fit mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Bank-Grade Security</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Secure cookie session tokens, API-level authorization, and encrypted transport layers.
            </p>
          </div>

          <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="p-2.5 bg-[var(--primary-muted)] text-[var(--primary)] rounded-md w-fit mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Lightning Performance</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Built on Next.js App Router for instant route transitions and minimal client JS payload.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
        &copy; {new Date().getFullYear()} ExpenseIQ. All rights reserved.
      </footer>
    </div>
  );
}
