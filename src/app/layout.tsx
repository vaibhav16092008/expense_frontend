import type { Metadata } from "next";
import "@/app/globals.css";
import { AppProviders } from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: {
    default: "ExpenseIQ — Intelligent Personal Finance SaaS",
    template: "%s | ExpenseIQ",
  },
  description:
    "Production-grade personal finance application for tracking expenses, budgets, financial goals, and analytics with precision.",
  keywords: ["personal finance", "expense tracker", "budget planner", "financial analytics", "saas"],
  authors: [{ name: "ExpenseIQ Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://expenseiq.app",
    title: "ExpenseIQ — Intelligent Personal Finance SaaS",
    description:
      "Production-grade personal finance application for tracking expenses, budgets, financial goals, and analytics with precision.",
    siteName: "ExpenseIQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
