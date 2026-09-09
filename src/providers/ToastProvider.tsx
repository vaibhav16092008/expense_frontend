"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, description, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Limit to max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => toast({ type: "success", title, description }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => toast({ type: "error", title, description }),
    [toast]
  );
  const warning = useCallback(
    (title: string, description?: string) => toast({ type: "warning", title, description }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) => toast({ type: "info", title, description }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-[var(--radius-md)] border shadow-[var(--shadow-md)] transition-all duration-200 animate-in fade-in slide-in-from-bottom-2",
              item.type === "success" && "bg-[var(--surface)] border-[var(--primary)] text-[var(--text-primary)]",
              item.type === "error" && "bg-[var(--surface)] border-[var(--danger)] text-[var(--text-primary)]",
              item.type === "warning" && "bg-[var(--surface)] border-[var(--warning)] text-[var(--text-primary)]",
              item.type === "info" && "bg-[var(--surface)] border-[var(--info)] text-[var(--text-primary)]"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === "success" && <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />}
              {item.type === "error" && <AlertCircle className="w-5 h-5 text-[var(--danger)]" />}
              {item.type === "warning" && <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />}
              {item.type === "info" && <Info className="w-5 h-5 text-[var(--info)]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">{item.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
