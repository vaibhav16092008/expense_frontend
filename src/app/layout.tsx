import type { Metadata, Viewport } from "next";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ExpenseIQ",
  },
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

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

