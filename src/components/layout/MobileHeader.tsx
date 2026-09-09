"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Menu } from "lucide-react";
import { UserMenu } from "./UserMenu";

export interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between h-14 px-4 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          aria-label="Open menu drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--primary)] text-white flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
            Expense<span className="text-[var(--primary)]">IQ</span>
          </span>
        </Link>
      </div>

      <UserMenu />
    </header>
  );
}
