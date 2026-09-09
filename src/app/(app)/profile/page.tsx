import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User, Clock } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            User Profile
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Account identity, personal information, avatar, and security credentials.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Phase F4 Module
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
            <User className="w-5 h-5" />
            <CardTitle>User Profile Module Scaffold</CardTitle>
          </div>
          <CardDescription>
            This module will handle personal info editing, password changes, active session revocation, and avatar uploads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-secondary)]/50 flex flex-col items-center justify-center text-center gap-2 min-h-[180px]">
            <Clock className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Phase F4 Implementation Ready
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              Profile editing forms, security settings, and avatar upload features will be built in Phase F4.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
