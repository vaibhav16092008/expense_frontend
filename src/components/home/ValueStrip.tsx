import React from "react";
import { Receipt, PieChart, BarChart3, WifiOff, ShieldCheck } from "lucide-react";

export function ValueStrip() {
  const values = [
    {
      icon: Receipt,
      title: "Simple Expense Tracking",
      description: "Fast logging & categorized flows",
    },
    {
      icon: PieChart,
      title: "Smart Budgeting",
      description: "Visual progress limits & alerts",
    },
    {
      icon: BarChart3,
      title: "Clear Financial Insights",
      description: "Breakdowns, trends & reports",
    },
    {
      icon: WifiOff,
      title: "Offline-Ready Transactions",
      description: "Queue locally & auto-sync",
    },
    {
      icon: ShieldCheck,
      title: "Privacy-Focused Architecture",
      description: "Account isolated, no unauth leaks",
    },
  ];

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--surface-secondary)]/50 transition-colors"
              >
                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] shrink-0 border border-[var(--primary)]/20">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
