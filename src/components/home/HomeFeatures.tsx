import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  Receipt,
  Tags,
  PieChart,
  Target,
  Repeat,
  BarChart3,
  Bell,
  WifiOff,
  ArrowRight,
} from "lucide-react";

export function HomeFeatures() {
  const features = [
    {
      icon: Receipt,
      title: "Expense & Income Tracking",
      description: "Record transactions and understand exactly where your money is going.",
      href: "/transactions",
    },
    {
      icon: Tags,
      title: "Categories",
      description: "Organize spending and income with flexible personal categories.",
      href: "/categories",
    },
    {
      icon: PieChart,
      title: "Budgets",
      description: "Set spending limits and see how you're progressing before you overspend.",
      href: "/budgets",
    },
    {
      icon: Target,
      title: "Savings Goals",
      description: "Set financial goals, contribute over time and track your progress.",
      href: "/goals",
    },
    {
      icon: Repeat,
      title: "Recurring Transactions",
      description: "Keep recurring income and expenses organized without forgetting important payments.",
      href: "/recurring",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Turn transaction history into useful trends, breakdowns and financial insights.",
      href: "/reports",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay aware of important financial events and reminders.",
      href: "/notifications",
    },
    {
      icon: WifiOff,
      title: "Offline Transactions",
      description: "Create transactions even when you're offline. ExpenseIQ syncs them when connectivity returns.",
      href: "/transactions",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Everything you need to stay on top of your money.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            One place for everyday spending, long-term goals and the decisions in between.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                href={feature.href}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[var(--radius-md)]"
              >
                <Card className="h-full border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-md)] transition-all duration-200 flex flex-col justify-between p-1">
                  <CardHeader className="p-5 pb-2">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center mb-4 border border-[var(--primary)]/20 group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base font-semibold group-hover:text-[var(--primary)] transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <div className="px-5 pb-4 pt-2 flex items-center gap-1 text-xs font-semibold text-[var(--primary)] group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
