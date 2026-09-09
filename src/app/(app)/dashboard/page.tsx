import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LayoutDashboard, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Centralized hub for financial health, liquidity, and expense trends.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Phase F2 Module
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
            <LayoutDashboard className="w-5 h-5" />
            <CardTitle>Dashboard Module Scaffold</CardTitle>
          </div>
          <CardDescription>
            This module will contain high-level metric cards, interactive income vs expense charts, recent transaction streams, and budget progress indicators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-secondary)]/50 flex flex-col items-center justify-center text-center gap-2 min-h-[180px]">
            <Clock className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Phase F2 Implementation Ready
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              Frontend foundation (F1) is established. Financial widgets, data fetching, and state management for this page will be implemented in Phase F2.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
