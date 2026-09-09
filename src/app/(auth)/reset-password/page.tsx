"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Lock, ArrowLeft } from "lucide-react";
import apiClient from "@/lib/api/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { success, error: toastError } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await apiClient.post("/auth/reset-password", { token, newPassword });
      success("Password updated", "You can now log in with your new credentials.");
      router.push("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password.";
      setErrorMessage(msg);
      toastError("Reset Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Reset Password</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Set a new password for your account</p>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs font-medium text-[var(--danger)] bg-[var(--danger-muted)] rounded-[var(--radius-md)] border border-[var(--danger)]/20">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="New Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          leftElement={<Lock className="w-4 h-4" />}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          leftElement={<Lock className="w-4 h-4" />}
        />

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          Update Password
        </Button>
      </form>

      <div className="text-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[var(--primary)] font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
