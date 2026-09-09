"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { UserMenu } from "./UserMenu";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/categories": "Categories",
  "/budgets": "Budgets",
  "/goals": "Financial Goals",
  "/recurring": "Recurring Payments",
  "/reports": "Financial Reports",
  "/notifications": "Notifications",
  "/profile": "User Profile",
  "/settings": "Settings",
};

export function AppHeader() {
  const pathname = usePathname();
  const title = routeTitles[pathname] || "ExpenseIQ";

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-6 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
      <div>
        <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-[var(--radius-md)] transition-colors relative"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary)]" />
        </Link>

        <div className="w-px h-5 bg-[var(--border-subtle)]" />

        <UserMenu />
      </div>
    </header>
  );
}
