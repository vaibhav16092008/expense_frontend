import React from "react";
import { Badge } from "@/components/ui/Badge";
import { ProfileCard } from "@/features/user/components/ProfileCard";
import { ChangePasswordCard } from "@/features/user/components/ChangePasswordCard";
import { DeleteAccountCard } from "@/features/user/components/DeleteAccountCard";

export const metadata = {
  title: "Profile | ExpenseIQ",
  description: "Manage user profile details, password, and security preferences.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            User Profile
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Account identity, personal information, and security credentials.
          </p>
        </div>
        <Badge variant="primary" size="md">
          Profile & Security
        </Badge>
      </div>

      {/* User Information */}
      <ProfileCard />

      {/* Security / Password Management */}
      <ChangePasswordCard />

      {/* Account Deletion / Danger Zone */}
      <DeleteAccountCard />
    </div>
  );
}
