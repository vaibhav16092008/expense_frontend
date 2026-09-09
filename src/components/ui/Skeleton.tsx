import React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-[var(--surface-secondary)] border border-[var(--border-subtle)]",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-[var(--radius-sm)] w-full",
        variant === "rectangular" && "rounded-[var(--radius-md)]",
        className
      )}
      {...props}
    />
  );
}
