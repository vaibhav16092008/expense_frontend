import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    primary: "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--primary)]/20",
    success: "bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/20",
    warning: "bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/20",
    danger: "bg-[var(--danger-muted)] text-[var(--danger)] border-[var(--danger)]/20",
    info: "bg-[var(--info-muted)] text-[var(--info)] border-[var(--info)]/20",
    neutral: "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border leading-none tracking-wide transition-colors select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
