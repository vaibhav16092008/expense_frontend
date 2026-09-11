"use client";

import React from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * Non-blocking global banner displayed when the browser is offline
 */
export function NetworkStatusBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="truncate">
            <strong className="font-semibold">You&apos;re offline.</strong> New transactions will be saved on this device and synced when you&apos;re back online.
          </span>
        </div>
      </div>
    </div>
  );
}
