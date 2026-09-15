import React from "react";
import { ShieldCheck, EyeOff, Lock, Server, FileText, UserCheck } from "lucide-react";

export function SecuritySection() {
  const pillars = [
    {
      icon: EyeOff,
      title: "Zero Search Indexing of Private Data",
      description:
        "All authenticated SaaS pages (dashboard, transactions, budgets, goals) are explicitly disallowed in search crawler rules to keep your finances private.",
    },
    {
      icon: ShieldCheck,
      title: "Network-Only Financial Cache Policy",
      description:
        "The PWA Service Worker caches only static application assets. Financial API responses and authorization headers strictly bypass Cache Storage.",
    },
    {
      icon: Lock,
      title: "Token-Free Offline Storage",
      description:
        "Browser IndexedDB storage holds only pending transaction payloads. Passwords, session cookies, and authorization tokens are never saved to IndexedDB.",
    },
    {
      icon: Server,
      title: "Production Security Headers",
      description:
        "Engineered with strict Content Security Policies, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and HSTS transport guarantees.",
    },
    {
      icon: UserCheck,
      title: "Strict Account Isolation",
      description:
        "Offline queues and server-side records are partitioned by user identity. Logging out immediately isolates and clears active browser queues.",
    },
    {
      icon: FileText,
      title: "Transparent & Audited Codebase",
      description:
        "Designed to follow established web security best practices, standardized API error normalization, and predictable session refresh lifecycles.",
    },
  ];

  return (
    <section id="security" className="py-20 md:py-28 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] block">
            Privacy & Security
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Built with privacy in mind.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Your financial information belongs to you. We design our software architecture from the
            ground up to prevent data leakage and maintain strong client-side isolation.
          </p>
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 shadow-[var(--shadow-sm)] transition-all duration-150"
              >
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center mb-4 border border-[var(--primary)]/20">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
