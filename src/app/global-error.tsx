"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected root layout errors to console
    console.error("[ExpenseIQ] Root layout error caught:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-[#f8fafc] flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full bg-[#111827] border border-[#1f2937] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc] mb-2">
            Application Error
          </h1>

          <p className="text-sm text-[#9ca3af] mb-6 leading-relaxed">
            An unexpected error occurred in the root layout. Please refresh or try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium text-sm rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1f2937] hover:bg-[#374151] text-[#f8fafc] font-medium text-sm rounded-lg transition-colors border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#9ca3af]/50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
