"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  LayoutDashboard,
  Receipt,
  Tags,
  PieChart,
  Target,
  Repeat,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const STORAGE_KEY = "expenseiq_sidebar_collapsed";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface NavGroupConfig {
  groupName?: string;
  items: NavItemConfig[];
}

const navGroups: NavGroupConfig[] = [
  {
    groupName: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    groupName: "FINANCES",
    items: [
      { label: "Transactions", href: "/transactions", icon: Receipt },
      { label: "Categories", href: "/categories", icon: Tags },
      { label: "Budgets", href: "/budgets", icon: PieChart },
      { label: "Goals", href: "/goals", icon: Target },
      { label: "Recurring", href: "/recurring", icon: Repeat },
    ],
  },
  {
    groupName: "INSIGHTS",
    items: [{ label: "Reports", href: "/reports", icon: BarChart3 }],
  },
  {
    groupName: "SYSTEM",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(STORAGE_KEY);
      return savedState === "true";
    }
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-200 ease-in-out select-none shrink-0 h-screen sticky top-0 z-30",
        isCollapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-subtle)] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
              Expense<span className="text-[var(--primary)]">IQ</span>
            </span>
          )}
        </Link>

        <button
          onClick={toggleCollapse}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {group.groupName && !isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">
                {group.groupName}
              </h4>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              const navLinkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-[var(--radius-md)] transition-colors",
                    isActive
                      ? "bg-[var(--primary-muted)] text-[var(--primary)] font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive && "text-[var(--primary)]")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href} content={item.label} position="right">
                    {navLinkContent}
                  </Tooltip>
                );
              }

              return <React.Fragment key={item.href}>{navLinkContent}</React.Fragment>;
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
