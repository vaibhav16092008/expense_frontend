import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 sm:p-6">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--primary)] text-white flex items-center justify-center shadow-[var(--shadow-sm)] group-hover:scale-105 transition-transform">
          <TrendingUp className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Expense<span className="text-[var(--primary)]">IQ</span>
        </span>
      </Link>

      {/* Auth Form Container */}
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-xs text-[var(--text-muted)] text-center">
        Protected by ExpenseIQ Security Policy
      </footer>
    </div>
  );
}
