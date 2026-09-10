import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sliders } from "lucide-react";
import { NotificationPreferences } from "@/features/notifications/components/NotificationPreferences";

export const metadata = {
  title: "Settings | ExpenseIQ",
  description: "Configure application settings and notification preferences.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Application Settings
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your account notification alerts, preferences, and system defaults.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Settings & Preferences
        </Badge>
      </div>

      {/* Notification Preferences */}
      <NotificationPreferences />

      {/* Additional System Settings Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
            <Sliders className="w-5 h-5" />
            <CardTitle>System & Display Settings</CardTitle>
          </div>
          <CardDescription>
            Appearance themes (Light / Dark / System) and regional preferences are automatically synchronized with your system.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
