import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Settings, Clock } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Application Settings
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Currency preferences, regional date formats, theme modes, and data backup controls.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Phase F4 Module
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
            <Settings className="w-5 h-5" />
            <CardTitle>Settings Module Scaffold</CardTitle>
          </div>
          <CardDescription>
            This module will allow configuring global currency defaults, dark/light themes, offline sync behavior, and data exports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-secondary)]/50 flex flex-col items-center justify-center text-center gap-2 min-h-[180px]">
            <Clock className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Phase F4 Implementation Ready
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              System preferences, currency selection, offline sync toggles, and data export features will be built in Phase F4.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
