"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function RecurringSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] space-y-4 shadow-[var(--shadow-xs)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-16 h-5" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>

          <div>
            <Skeleton className="w-32 h-7 mb-2" />
            <Skeleton className="w-24 h-4" />
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
