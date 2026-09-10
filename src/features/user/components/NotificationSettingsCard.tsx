"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { BellRing, ShieldAlert, CalendarClock, Target, PieChart, Info } from "lucide-react";
import { useUserSettings, useUpdateUserSettings } from "../hooks/useUser";
import { useToast } from "@/providers/ToastProvider";

export function NotificationSettingsCard() {
  const { data: settings, isLoading, isError, error: fetchError } = useUserSettings();
  const updateMutation = useUpdateUserSettings();
  const { success, error } = useToast();

  const handleToggle = async (
    key: "budgetAlertsEnabled" | "recurringRemindersEnabled" | "goalRemindersEnabled",
    currentValue: boolean
  ) => {
    if (!settings || updateMutation.isPending) return;

    const newValue = !currentValue;
    try {
      await updateMutation.mutateAsync({
        [key]: newValue,
      });
      success("Notification preference saved", "Your alert preference has been updated.");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error("Failed to save preference", errorObj.message || "An unexpected error occurred.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" className="w-48 h-6" />
          <Skeleton variant="text" className="w-72 h-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton variant="rectangular" className="w-full h-16" />
          <Skeleton variant="rectangular" className="w-full h-16" />
          <Skeleton variant="rectangular" className="w-full h-16" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !settings) {
    const errorMsg = (fetchError as { message?: string })?.message || "Failed to load notification settings.";
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[var(--danger)]">Notification Preferences Unavailable</CardTitle>
          <CardDescription>{errorMsg}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const prefs = settings;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <BellRing className="w-5 h-5" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Configure which financial notifications and automated reminders you wish to receive.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Budget Alerts Toggle */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 hover:bg-[var(--surface-secondary)]/70 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--warning-muted)] text-[var(--warning)] shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="user-pref-budget-alerts" className="text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                Budget Alerts
              </label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Receive warnings when budget spending reaches critical thresholds (80%, 90%, 100%).
              </p>
            </div>
          </div>
          <input
            id="user-pref-budget-alerts"
            type="checkbox"
            checked={prefs.budgetAlertsEnabled}
            onChange={() => handleToggle("budgetAlertsEnabled", prefs.budgetAlertsEnabled)}
            disabled={updateMutation.isPending}
            className="w-5 h-5 rounded accent-[var(--primary)] cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="Toggle budget alerts"
          />
        </div>

        {/* Recurring Reminders Toggle */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 hover:bg-[var(--surface-secondary)]/70 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--info-muted)] text-[var(--info)] shrink-0 mt-0.5">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="user-pref-recurring-reminders" className="text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                Recurring Payment Reminders
              </label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Get notified when recurring subscriptions, bills, or scheduled payments are due.
              </p>
            </div>
          </div>
          <input
            id="user-pref-recurring-reminders"
            type="checkbox"
            checked={prefs.recurringRemindersEnabled}
            onChange={() => handleToggle("recurringRemindersEnabled", prefs.recurringRemindersEnabled)}
            disabled={updateMutation.isPending}
            className="w-5 h-5 rounded accent-[var(--primary)] cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="Toggle recurring payment reminders"
          />
        </div>

        {/* Goal Reminders Toggle */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 hover:bg-[var(--surface-secondary)]/70 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--success-muted)] text-[var(--success)] shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="user-pref-goal-reminders" className="text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                Goal Reminders & Milestones
              </label>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Get progress updates when approaching or reaching savings goal milestones.
              </p>
            </div>
          </div>
          <input
            id="user-pref-goal-reminders"
            type="checkbox"
            checked={prefs.goalRemindersEnabled}
            onChange={() => handleToggle("goalRemindersEnabled", prefs.goalRemindersEnabled)}
            disabled={updateMutation.isPending}
            className="w-5 h-5 rounded accent-[var(--primary)] cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="Toggle goal reminders and milestones"
          />
        </div>

        {/* Monthly Summary (READ-ONLY) - Note: monthlySummaryEnabled is system-managed and not accepted by backend PATCH /api/users/settings */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/20 opacity-80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] shrink-0 mt-0.5">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Monthly Financial Summaries
                </span>
                <Badge variant="neutral" size="sm" className="gap-1 text-[10px]">
                  <Info className="w-3 h-3 text-[var(--info)]" />
                  System managed
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Automated monthly digest generation is managed by system policy.
              </p>
            </div>
          </div>
          <input
            id="user-pref-monthly-summary"
            type="checkbox"
            checked={true}
            disabled
            className="w-5 h-5 rounded accent-[var(--primary)] cursor-not-allowed opacity-50 shrink-0"
            aria-label="Monthly financial summaries status (read-only)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
