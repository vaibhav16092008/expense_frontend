import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, LogIn } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="py-20 md:py-24 border-t border-[var(--border)] bg-gradient-to-b from-[var(--surface-secondary)]/40 to-[var(--surface)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Take control of your money.
        </h2>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          Start tracking smarter, plan with confidence and understand your financial habits
          today with ExpenseIQ.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started Free
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<LogIn className="w-4 h-4" />}>
              Sign In to Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
