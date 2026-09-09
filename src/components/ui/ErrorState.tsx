import React from "react";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data. Please try again or contact support if the problem persists.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-[var(--danger)]/30 rounded-[var(--radius-lg)] bg-[var(--danger-muted)]/20 min-h-[220px]",
        className
      )}
    >
      <div className="p-3 bg-[var(--danger-muted)] text-[var(--danger)] rounded-full mb-3 shrink-0">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>

      <p className="text-xs text-[var(--text-secondary)] max-w-md mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
}
