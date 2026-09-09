"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Sidebar } from "./Sidebar";
import { AppHeader } from "./AppHeader";
import { MobileHeader } from "./MobileHeader";
import { Drawer } from "@/components/ui/Drawer";
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
  TrendingUp,
} from "lucide-react";

export interface AppShellProps {
  children: React.ReactNode;
}

const mobileNavLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: Receipt },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "Budgets", href: "/budgets", icon: PieChart },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Recurring", href: "/recurring", icon: Repeat },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <MobileHeader onMenuOpen={() => setIsMobileMenuOpen(true)} />

        {/* Desktop Header Bar */}
        <AppHeader />

        {/* Main Content Slot */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        position="left"
        title="Navigation"
      >
        <div className="flex flex-col gap-1 py-2">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-4 border-b border-[var(--border-subtle)] pb-4">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--primary)] text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-[var(--text-primary)]">
              Expense<span className="text-[var(--primary)]">IQ</span>
            </span>
          </div>

          {mobileNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[var(--radius-md)] transition-colors",
                  isActive
                    ? "bg-[var(--primary-muted)] text-[var(--primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "text-[var(--primary)]")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}
