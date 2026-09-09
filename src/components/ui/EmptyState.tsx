import React from "react";
import { cn } from "@/lib/utils/cn";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <FolderOpen className="w-8 h-8 text-[var(--text-muted)]" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)]/50 min-h-[220px]",
        className
      )}
    >
      <div className="p-3 bg-[var(--surface-secondary)] rounded-full mb-3 shrink-0">{icon}</div>

      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>

      {description && (
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
