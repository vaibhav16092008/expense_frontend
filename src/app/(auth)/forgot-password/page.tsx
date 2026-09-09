"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import apiClient from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      await apiClient.post("/auth/forgot-password", { email }).catch(() => {});
      setIsSubmitted(true);
      success("Reset link sent", "If an account exists, a recovery link has been dispatched.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to request password reset.";
      toastError("Request Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Forgot Password</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Enter your email to receive a password reset link
        </p>
      </div>

      {isSubmitted ? (
        <div className="flex flex-col items-center text-center p-4 bg-[var(--primary-muted)] border border-[var(--primary)]/20 rounded-[var(--radius-md)]">
          <CheckCircle2 className="w-8 h-8 text-[var(--primary)] mb-2" />
          <p className="text-xs text-[var(--text-primary)] font-medium">Reset instructions sent!</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Please check your inbox at <span className="font-semibold">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftElement={<Mail className="w-4 h-4" />}
          />

          <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
            Send Recovery Link
          </Button>
        </form>
      )}

      <div className="text-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[var(--primary)] font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
