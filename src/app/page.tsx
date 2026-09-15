import type { Metadata } from "next";
import {
  HomeNavbar,
  HomeHero,
  ValueStrip,
  HomeFeatures,
  HowItWorks,
  DashboardShowcase,
  OfflineSection,
  SecuritySection,
  HomeCTA,
  HomeFooter,
} from "@/components/home";

export const metadata: Metadata = {
  title: "ExpenseIQ — Personal Finance, Simplified",
  description:
    "Track expenses, manage budgets, set savings goals and understand your finances with ExpenseIQ.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--primary)] selection:text-white">
      <HomeNavbar />
      <main className="flex-1">
        <HomeHero />
        <ValueStrip />
        <HomeFeatures />
        <HowItWorks />
        <DashboardShowcase />
        <OfflineSection />
        <SecuritySection />
        <HomeCTA />
      </main>
      <HomeFooter />
    </div>
  );
}
