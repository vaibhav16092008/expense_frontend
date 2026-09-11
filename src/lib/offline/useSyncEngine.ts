"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { syncEngine } from "./syncEngine";

/**
 * Hook to automatically orchestrate background sync execution on network recovery and app start
 */
export function useSyncEngine() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const triggerSync = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      await syncEngine.syncUserQueue(user.id, queryClient);
    } catch (err) {
      console.warn("[ExpenseIQ SyncEngine] Background sync error:", err);
    }
  }, [isAuthenticated, user, queryClient]);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated || !user?.id) {
      return;
    }

    // 1. Sync on app initialization
    triggerSync();

    // 2. Listener for online event
    const handleOnline = () => {
      triggerSync();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [isAuthenticated, user?.id, triggerSync]);

  return {
    triggerSync,
  };
}
