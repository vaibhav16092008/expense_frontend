"use client";

import React from "react";
import { DateRangeParams } from "../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar } from "lucide-react";

export interface ReportDateRangeProps {
  dateRange: DateRangeParams;
  onChange: (newRange: DateRangeParams) => void;
}

export function formatDateYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ReportDateRange({ dateRange, onChange }: ReportDateRangeProps) {
  const handlePreset = (preset: "this-month" | "last-month" | "last-3-months" | "last-6-months" | "this-year") => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    let fromDate: Date;
    let toDate: Date;

    switch (preset) {
      case "this-month":
        fromDate = new Date(y, m, 1);
        toDate = new Date(y, m + 1, 0);
        break;
      case "last-month":
        fromDate = new Date(y, m - 1, 1);
        toDate = new Date(y, m, 0);
        break;
      case "last-3-months":
        fromDate = new Date(y, m - 2, 1);
        toDate = new Date(y, m + 1, 0);
        break;
      case "last-6-months":
        fromDate = new Date(y, m - 5, 1);
        toDate = new Date(y, m + 1, 0);
        break;
      case "this-year":
        fromDate = new Date(y, 0, 1);
        toDate = new Date(y, 11, 31);
        break;
    }

    onChange({
      from: formatDateYYYYMMDD(fromDate),
      to: formatDateYYYYMMDD(toDate),
    });
  };

  return (
    <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Preset Quick Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[var(--text-secondary)] mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" /> Presets:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset("this-month")}
            className="text-xs h-7 px-2.5"
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset("last-month")}
            className="text-xs h-7 px-2.5"
          >
            Last Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset("last-3-months")}
            className="text-xs h-7 px-2.5"
          >
            Last 3 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset("last-6-months")}
            className="text-xs h-7 px-2.5"
          >
            Last 6 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset("this-year")}
            className="text-xs h-7 px-2.5"
          >
            This Year
          </Button>
        </div>

        {/* Explicit Custom Date Inputs */}
        <div className="flex items-center gap-3">
          <div className="w-36">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => {
                if (e.target.value) {
                  onChange({ ...dateRange, from: e.target.value });
                }
              }}
              className="h-8 text-xs py-1"
            />
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">to</span>
          <div className="w-36">
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => {
                if (e.target.value) {
                  onChange({ ...dateRange, to: e.target.value });
                }
              }}
              className="h-8 text-xs py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
