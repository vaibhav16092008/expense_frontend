import React from "react";
import {
  WifiOff,
  Database,
  RefreshCw,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";

export function OfflineSection() {
  const steps = [
    {
      icon: WifiOff,
      title: "1. Go Offline",
      desc: "Subway, flight, or spotty connectivity.",
    },
    {
      icon: Database,
      title: "2. Saved Locally",
      desc: "Instantly stored in isolated IndexedDB queue.",
    },
    {
      icon: Layers,
      title: "3. Auto Queue",
      desc: "Idempotent tracking with unique client request IDs.",
    },
    {
      icon: Wifi,
      title: "4. Return Online",
      desc: "System detects network recovery automatically.",
    },
    {
      icon: RefreshCw,
      title: "5. Safe Sync",
      desc: "Web Locks serialize background replay across tabs.",
    },
    {
      icon: CheckCircle2,
      title: "6. Reconciled",
      desc: "Transactions confirmed in your permanent account.",
    },
  ];

  return (
    <section className="py-20 md:py-28 border-y border-[var(--border)] bg-[var(--surface-secondary)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-xs font-semibold uppercase tracking-wider border border-[var(--primary)]/20">
            <WifiOff className="w-3.5 h-3.5" />
            <span>PWA & Offline-First Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Your transactions don&apos;t have to wait for the internet.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            ExpenseIQ queues new transactions locally when you&apos;re offline and automatically syncs
            them when your connection returns — zero duplicate entries, zero lost data.
          </p>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center mb-3.5 border border-[var(--primary)]/20">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Supporting Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface)]">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)] mb-2">
              <Database className="w-4 h-4 text-[var(--primary)]" />
              <span>Isolated Local Storage</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Queued records live strictly inside the browser&apos;s IndexedDB, isolated by user account,
              and completely separate from Service Worker cache storage.
            </p>
          </div>

          <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface)]">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)] mb-2">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              <span>Idempotent Synchronization</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every offline transaction is assigned a cryptographic UUID. Temporary network dropouts
              trigger exponential retries without creating duplicates.
            </p>
          </div>

          <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface)]">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)] mb-2">
              <Layers className="w-4 h-4 text-[var(--primary)]" />
              <span>Multi-Tab Coordination</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Native Web Locks and BroadcastChannel ensure only one browser tab syncs at a time while
              all other tabs update their UI queues instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
