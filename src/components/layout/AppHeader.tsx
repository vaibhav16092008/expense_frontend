"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useUnreadCount } from "@/features/notifications/hooks/useNotifications";

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

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.data?.count ?? 0;

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-6 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
      <div>
        <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-[var(--radius-md)] transition-colors relative flex items-center justify-center"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "View notifications"}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-white bg-[var(--primary)] rounded-full border border-[var(--surface)]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="w-px h-5 bg-[var(--border-subtle)]" />

        <UserMenu />
      </div>
    </header>
  );
}
