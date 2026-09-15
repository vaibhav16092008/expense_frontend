import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12 md:py-16 text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[var(--radius-sm)] w-fit"
            >
              <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                Expense<span className="text-[var(--primary)]">IQ</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              Personal finance, simplified. Track your spending, set limits, and achieve financial goals with precision and offline resilience.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-[var(--primary)] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--primary)] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-[var(--primary)] transition-colors">
                  Reports
                </Link>
              </li>
              <li>
                <Link href="/budgets" className="hover:text-[var(--primary)] transition-colors">
                  Budgets
                </Link>
              </li>
              <li>
                <Link href="/goals" className="hover:text-[var(--primary)] transition-colors">
                  Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-[var(--primary)] transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[var(--primary)] transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="#security" className="hover:text-[var(--primary)] transition-colors">
                  Security & Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <p>&copy; 2026 ExpenseIQ. All rights reserved.</p>
          <p className="text-[11px]">Production-Grade Personal Finance SaaS</p>
        </div>
      </div>
    </footer>
  );
}
