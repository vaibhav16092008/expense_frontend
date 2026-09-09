"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Spinner } from "@/components/ui/Spinner";

export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is resolved and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      // Allow demo viewing or redirect to login
      const isPublicAccess = process.env.NEXT_PUBLIC_ALLOW_UNAUTH === "true";
      if (!isPublicAccess) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs font-medium text-[var(--text-muted)]">Restoring session...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
