"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { useUserSettings, useUpdateUserSettings } from "../hooks/useUser";
import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import { Theme } from "@/types/common";
import { cn } from "@/lib/utils/cn";

export function AppearanceSettingsCard() {
  const { theme, setTheme: setAppTheme } = useTheme();
  const { data: settings, isLoading, isError } = useUserSettings();
  const updateMutation = useUpdateUserSettings();
  const { success, error } = useToast();

  // Synchronize backend theme preference to ThemeProvider on initial load if valid
  useEffect(() => {
    if (settings?.theme && settings.theme !== theme) {
      setAppTheme(settings.theme);
    }
  }, [settings?.theme, theme, setAppTheme]);

  const handleSelectTheme = async (selectedTheme: Theme) => {
    if (selectedTheme === theme || updateMutation.isPending) return;

    const previousTheme = theme;
    // Optimistic UI update for immediate response
    setAppTheme(selectedTheme);

    try {
      await updateMutation.mutateAsync({ theme: selectedTheme });
      success("Theme preference saved", `Appearance updated to ${selectedTheme} mode.`);
    } catch (err: unknown) {
      // Rollback to previous theme if API update fails
      setAppTheme(previousTheme);
      const errorObj = err as { message?: string };
      error("Failed to save theme", errorObj.message || "An unexpected error occurred.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" className="w-36 h-6" />
          <Skeleton variant="text" className="w-64 h-4" />
        </CardHeader>
        <CardContent>
          <Skeleton variant="rectangular" className="w-full h-24" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return null;
  }

  const activeTheme = theme || settings?.theme || "system";

  const themeOptions: { value: Theme; label: string; description: string; icon: React.ElementType }[] = [
    {
      value: "light",
      label: "Light Mode",
      description: "Clean, high-contrast light appearance",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark Mode",
      description: "Sleek dark interface easy on the eyes",
      icon: Moon,
    },
    {
      value: "system",
      label: "System Default",
      description: "Automatically matches your operating system",
      icon: Monitor,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <Palette className="w-5 h-5" />
          <CardTitle>Appearance & Theme</CardTitle>
        </div>
        <CardDescription>
          Customize the look and feel of ExpenseIQ across all devices.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = activeTheme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectTheme(option.value)}
                disabled={updateMutation.isPending}
                className={cn(
                  "flex flex-col items-start p-4 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--primary-muted)]/15 shadow-xs"
                    : "border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30 hover:bg-[var(--surface-secondary)]/80 hover:border-[var(--border)]",
                  updateMutation.isPending && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={cn(
                      "p-2 rounded-[var(--radius-md)] shrink-0",
                      isSelected
                        ? "bg-[var(--primary)] text-[var(--surface)]"
                        : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
                  )}
                </div>

                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {option.label}
                </span>
                <span className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
