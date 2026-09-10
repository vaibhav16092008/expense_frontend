"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";
import { useDeleteAccount } from "../hooks/useUser";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";

export function DeleteAccountCard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { success, error } = useToast();
  const deleteAccountMutation = useDeleteAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setPassword("");
    setPasswordError(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError("Password is required for account deletion");
      return;
    }

    try {
      setPasswordError(null);
      await deleteAccountMutation.mutateAsync({ password });

      success("Account Deleted", "Your account and all associated data have been permanently removed.");
      setIsModalOpen(false);

      // Perform auth session cleanup and redirect
      await logout();
      queryClient.clear();
      router.push("/login");
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      if (errorObj.status === 429) {
        setPasswordError("Too many deletion attempts. Please try again later.");
      } else {
        const message = errorObj.message || "Incorrect password. Failed to delete account.";
        setPasswordError(message);
      }
      error("Account Deletion Failed", errorObj.message || "Please check your password.");
    }
  };

  return (
    <>
      <Card className="border-[var(--danger)]/30 bg-[var(--danger-muted)]/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--danger)] mb-1">
            <Trash2 className="w-5 h-5" />
            <CardTitle>Danger Zone — Delete Account</CardTitle>
          </div>
          <CardDescription>
            Permanently remove your ExpenseIQ account, preferences, and all financial data.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-3.5 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-muted)]/20 text-xs text-[var(--text-secondary)] leading-relaxed">
            <p className="font-semibold text-[var(--danger)] mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Warning: This action is permanent and non-reversible
            </p>
            Deleting your account will remove all transactions, category definitions, budget allocations, savings goals, recurring rules, and custom settings.
          </div>

          <div className="flex justify-end">
            <Button variant="danger" onClick={handleOpenModal} className="gap-1.5">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!deleteAccountMutation.isPending) setIsModalOpen(false);
        }}
        title="Confirm Account Deletion"
        description="Are you absolutely sure? This cannot be undone."
        size="md"
      >
        <form onSubmit={handleConfirmDelete} className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--danger-muted)] text-[var(--danger)] border border-[var(--danger)]/20">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              You are about to permanently delete your account and all associated financial records. Please enter your password to confirm.
            </p>
          </div>

          <Input
            type="password"
            label="Confirm with Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="Enter your current password"
            error={passwordError || undefined}
            required
            disabled={deleteAccountMutation.isPending}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={deleteAccountMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={deleteAccountMutation.isPending}
              disabled={deleteAccountMutation.isPending || !password}
            >
              Permanently Delete Account
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
