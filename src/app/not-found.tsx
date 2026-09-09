import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-[var(--primary-muted)] text-[var(--primary)] rounded-full mb-4">
        <FileQuestion className="w-10 h-10" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">
        404 — Page Not Found
      </h1>

      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link href="/dashboard">
        <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
