"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !password) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      await register({ fullName, email, password });
      success("Account created!", "Welcome to ExpenseIQ. Setting up your workspace...");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register.";
      setErrorMessage(msg);
      toastError("Registration Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Create Account</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Start tracking your personal finances with ExpenseIQ</p>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs font-medium text-[var(--danger)] bg-[var(--danger-muted)] rounded-[var(--radius-md)] border border-[var(--danger)]/20">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          leftElement={<User className="w-4 h-4" />}
        />

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
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftElement={<Lock className="w-4 h-4" />}
        />

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
