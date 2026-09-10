"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "../hooks/useUser";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";

export function ChangePasswordCard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { success, error } = useToast();
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    form?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      success(
        "Password changed successfully",
        "Your password has been updated. Please sign in with your new password."
      );

      // Reset fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Revoke session & redirect to login using existing AuthProvider cleanup
      await logout();
      queryClient.clear();
      router.push("/login");
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      if (errorObj.status === 429) {
        setErrors({
          form: "Too many password change attempts. Please try again later.",
        });
      } else {
        const message = errorObj.message || "Failed to change password. Please check your credentials.";
        setErrors({ form: message });
      }
      error("Password update failed", errorObj.message || "Please check your current password.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <Lock className="w-5 h-5" />
          <CardTitle>Security & Password</CardTitle>
        </div>
        <CardDescription>
          Update your account password to maintain security. Changing password will sign you out of all sessions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3 text-xs font-medium text-[var(--danger)] bg-[var(--danger-muted)] rounded-[var(--radius-md)] border border-[var(--danger)]/20">
              {errors.form}
            </div>
          )}

          {/* Current Password */}
          <Input
            type={showCurrentPassword ? "text" : "password"}
            label="Current Password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (errors.currentPassword || errors.form) {
                setErrors((prev) => ({ ...prev, currentPassword: undefined, form: undefined }));
              }
            }}
            placeholder="Enter your current password"
            error={errors.currentPassword}
            required
            disabled={changePasswordMutation.isPending}
            rightElement={
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="hover:text-[var(--text-primary)] transition-colors focus:outline-none"
                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* New Password */}
          <Input
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword || errors.form) {
                setErrors((prev) => ({ ...prev, newPassword: undefined, form: undefined }));
              }
            }}
            placeholder="Minimum 6 characters"
            error={errors.newPassword}
            helperText="Password must be at least 6 characters long."
            required
            disabled={changePasswordMutation.isPending}
            rightElement={
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="hover:text-[var(--text-primary)] transition-colors focus:outline-none"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Confirm New Password */}
          <Input
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword || errors.form) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined, form: undefined }));
              }
            }}
            placeholder="Re-enter your new password"
            error={errors.confirmPassword}
            required
            disabled={changePasswordMutation.isPending}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={changePasswordMutation.isPending}>
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
