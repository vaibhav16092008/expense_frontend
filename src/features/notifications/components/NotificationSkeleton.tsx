"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function NotificationSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading notifications">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Card key={idx} className="p-4 flex items-start gap-4">
          <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Skeleton variant="text" className="w-1/3 h-4" />
              <Skeleton variant="text" className="w-20 h-3" />
            </div>
            <Skeleton variant="text" className="w-3/4 h-3.5" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton variant="rectangular" className="w-16 h-5 rounded-full" />
              <Skeleton variant="rectangular" className="w-24 h-5 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
