import React from "react";
import { PlusCircle, SlidersHorizontal, BarChart4 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: PlusCircle,
      title: "Track",
      description: "Add your income and expenses in seconds, whether you are online or on the go.",
    },
    {
      number: "02",
      icon: SlidersHorizontal,
      title: "Organize",
      description: "Use categories, budgets and recurring transactions to keep everything structured.",
    },
    {
      number: "03",
      icon: BarChart4,
      title: "Understand",
      description: "Use your dashboard, reports and goals to make better financial decisions.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-y border-[var(--border)] bg-[var(--surface)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] block">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            From transaction to insight in three steps.
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            No complex setup or spreadsheets needed. ExpenseIQ fits seamlessly into your daily life.
          </p>
        </div>

        {/* 3 Steps Grid with Connecting Line Representation */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Subtle connecting line across desktop columns */}
          <div
            className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-[var(--border)] -translate-y-8 -z-0"
            aria-hidden="true"
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/30 transition-all duration-150"
              >
                {/* Step Badge */}
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] mb-4">
                  STEP {step.number}
                </span>

                {/* Step Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center mb-5 border border-[var(--primary)]/20 shadow-[var(--shadow-sm)]">
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
