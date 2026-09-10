import React from "react";
import { Badge } from "@/components/ui/Badge";
import { AppearanceSettingsCard } from "@/features/user/components/AppearanceSettingsCard";
import { FinanceSettingsCard } from "@/features/user/components/FinanceSettingsCard";
import { NotificationSettingsCard } from "@/features/user/components/NotificationSettingsCard";

export const metadata = {
  title: "Settings | ExpenseIQ",
  description: "Configure application settings, theme, currency, and notification preferences.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Application Settings
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your appearance, active display currency, monthly budget limits, and notification alerts.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Settings & Preferences
        </Badge>
      </div>

      {/* Appearance / Theme Settings */}
      <AppearanceSettingsCard />

      {/* Finance / Currency & Monthly Budget Settings */}
      <FinanceSettingsCard />

      {/* Notification Preferences */}
      <NotificationSettingsCard />
    </div>
  );
}
