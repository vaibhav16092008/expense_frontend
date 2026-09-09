"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function ReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metrics Summary Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-7" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="h-80">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="h-56">
          <Skeleton className="h-full w-full rounded-[var(--radius-md)]" />
        </CardContent>
      </Card>
    </div>
  );
}
