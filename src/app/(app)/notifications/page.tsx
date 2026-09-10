import React, { Suspense } from "react";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { NotificationPreferences } from "@/features/notifications/components/NotificationPreferences";
import { NotificationSkeleton } from "@/features/notifications/components/NotificationSkeleton";

export const metadata = {
  title: "Notifications | ExpenseIQ",
  description: "View financial alerts, budget warnings, recurring payment reminders, and notification preferences.",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-8 pb-10">
      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationList />
      </Suspense>

      <div className="pt-6 border-t border-[var(--border-subtle)]">
        <NotificationPreferences />
      </div>
    </div>
  );
}
