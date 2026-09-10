"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { User, Mail, Calendar, Edit3, ShieldCheck } from "lucide-react";
import { useUserProfile, useUpdateUserProfile } from "../hooks/useUser";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { formatDate } from "@/utils/formatting/date";

export function ProfileCard() {
  const { data: profile, isLoading, isError, error: fetchError } = useUserProfile();
  const updateMutation = useUpdateUserProfile();
  const { user, refreshSession } = useAuth();
  const { success, error } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const openEditModal = () => {
    setNameInput(profile?.name || user?.fullName || "");
    setValidationError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      setValidationError("Name must be at least 1 character");
      return;
    }

    if (trimmedName.length > 100) {
      setValidationError("Name must not exceed 100 characters");
      return;
    }

    if (trimmedName === profile?.name) {
      setIsEditModalOpen(false);
      return;
    }

    try {
      setValidationError(null);
      await updateMutation.mutateAsync({ name: trimmedName });
      await refreshSession();
      success("Profile updated", "Your profile information has been saved.");
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error("Failed to update profile", errorObj.message || "An unexpected error occurred.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" className="w-40 h-6" />
          <Skeleton variant="text" className="w-64 h-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton variant="rectangular" className="w-full h-12" />
          <Skeleton variant="rectangular" className="w-full h-12" />
          <Skeleton variant="rectangular" className="w-full h-12" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    const errorMsg = (fetchError as { message?: string })?.message || "Failed to load profile.";
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[var(--danger)]">Profile Unavailable</CardTitle>
          <CardDescription>{errorMsg}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const displayName = profile?.name || user?.fullName || "ExpenseIQ User";
  const displayEmail = profile?.email || user?.email || "user@expenseiq.app";
  const memberSinceFormatted = profile?.createdAt
    ? formatDate(profile.createdAt, { year: "numeric", month: "long", day: "numeric" })
    : "Recently joined";

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
              <User className="w-5 h-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Your personal account details and primary profile identity.
            </CardDescription>
          </div>
          <Button variant="secondary" size="sm" onClick={openEditModal} className="gap-1.5">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center justify-between p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] font-bold text-sm flex items-center justify-center border border-[var(--primary)]/20 shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium">Full Name</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {displayName}
                </p>
              </div>
            </div>
          </div>

          {/* Email Address (Read-Only) */}
          <div className="flex items-center justify-between p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--info-muted)] text-[var(--info)] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium">Email Address</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {displayEmail}
                </p>
              </div>
            </div>
            <Badge variant="neutral" size="sm" className="gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
              Read-only
            </Badge>
          </div>

          {/* Member Since */}
          <div className="flex items-center justify-between p-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium">Member Since</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {memberSinceFormatted}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Name Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
        description="Update your display name across ExpenseIQ."
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Enter your full name"
            error={validationError || undefined}
            required
            maxLength={100}
            disabled={updateMutation.isPending}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
