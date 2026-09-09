import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PieChart, Clock } from "lucide-react";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Budgets
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Monthly, quarterly, and annual budget planning with progress tracking.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Phase F3 Module
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
            <PieChart className="w-5 h-5" />
            <CardTitle>Budgets Module Scaffold</CardTitle>
          </div>
          <CardDescription>
            This module will feature progress indicators, alert thresholds, rollover settings, and variance calculations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-secondary)]/50 flex flex-col items-center justify-center text-center gap-2 min-h-[180px]">
            <Clock className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Phase F3 Implementation Ready
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              Budget allocation controls, spending alerts, and progress visualizers will be implemented in Phase F3.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
