"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      success("Logged in successfully", "Redirecting to your dashboard...");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log in.";
      setErrorMessage(msg);
      toastError("Login Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Welcome Back</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Sign in to manage your ExpenseIQ account</p>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs font-medium text-[var(--danger)] bg-[var(--danger-muted)] rounded-[var(--radius-md)] border border-[var(--danger)]/20">
          {errorMessage}
        </div>
      )}

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

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftElement={<Lock className="w-4 h-4" />}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[var(--primary)] font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
