"use client";

import React, { useState } from "react";
import { DateRangeParams, ReportGroupBy, ReportType } from "../types";
import {
  downloadFinancialBackupJson,
  downloadReportCsv,
  downloadTransactionsCsv,
} from "../api";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { useToast } from "@/providers/ToastProvider";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  Table,
} from "lucide-react";

export interface ReportExportMenuProps {
  dateRange: DateRangeParams;
  groupBy: ReportGroupBy;
}

export function ReportExportMenu({ dateRange, groupBy }: ReportExportMenuProps) {
  const toast = useToast();
  const [downloadingAction, setDownloadingAction] = useState<string | null>(null);

  const handleExportTransactions = async () => {
    try {
      setDownloadingAction("transactions");
      toast.info("Preparing CSV Download", "Generating transactions CSV file...");
      await downloadTransactionsCsv({
        from: dateRange.from,
        to: dateRange.to,
      });
      toast.success("Download Complete", "Transactions CSV downloaded successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export transactions";
      toast.error("Download Failed", msg);
    } finally {
      setDownloadingAction(null);
    }
  };

  const handleExportReport = async (type: ReportType) => {
    try {
      setDownloadingAction(`report-${type}`);
      toast.info("Preparing Report CSV", `Generating ${type} report CSV file...`);
      await downloadReportCsv({
        type,
        from: dateRange.from,
        to: dateRange.to,
        groupBy: type === "cash-flow" || type === "savings" ? groupBy : undefined,
      });
      toast.success("Download Complete", `${type.toUpperCase()} report CSV downloaded.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export report";
      toast.error("Download Failed", msg);
    } finally {
      setDownloadingAction(null);
    }
  };

  const handleExportBackup = async () => {
    try {
      setDownloadingAction("backup");
      toast.info("Preparing Account Backup", "Generating complete financial JSON backup...");
      await downloadFinancialBackupJson();
      toast.success("Backup Downloaded", "Financial backup JSON saved successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export financial backup";
      toast.error("Backup Failed", msg);
    } finally {
      setDownloadingAction(null);
    }
  };

  const isDownloading = Boolean(downloadingAction);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Dropdown Menu for CSV Exports */}
      <Dropdown
        align="right"
        trigger={
          <Button
            variant="outline"
            size="sm"
            isLoading={isDownloading}
            leftIcon={<Download className="w-4 h-4 text-[var(--primary)]" />}
          >
            Export Data
          </Button>
        }
      >
        <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Transaction Exports
        </div>
        <DropdownItem
          onClick={handleExportTransactions}
          disabled={isDownloading}
        >
          <FileSpreadsheet className="w-4 h-4 text-[var(--primary)]" />
          Export Transactions CSV
        </DropdownItem>

        <DropdownDivider />

        <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Report CSV Exports
        </div>
        <DropdownItem
          onClick={() => handleExportReport("summary")}
          disabled={isDownloading}
        >
          <Table className="w-4 h-4 text-[var(--text-secondary)]" />
          Summary Report CSV
        </DropdownItem>
        <DropdownItem
          onClick={() => handleExportReport("cash-flow")}
          disabled={isDownloading}
        >
          <Table className="w-4 h-4 text-[var(--text-secondary)]" />
          Cash Flow Report CSV
        </DropdownItem>
        <DropdownItem
          onClick={() => handleExportReport("categories")}
          disabled={isDownloading}
        >
          <Table className="w-4 h-4 text-[var(--text-secondary)]" />
          Categories Report CSV
        </DropdownItem>
        <DropdownItem
          onClick={() => handleExportReport("budgets")}
          disabled={isDownloading}
        >
          <Table className="w-4 h-4 text-[var(--text-secondary)]" />
          Budgets Report CSV
        </DropdownItem>
        <DropdownItem
          onClick={() => handleExportReport("savings")}
          disabled={isDownloading}
        >
          <Table className="w-4 h-4 text-[var(--text-secondary)]" />
          Savings Report CSV
        </DropdownItem>
      </Dropdown>

      {/* Distinct Financial JSON Backup Action */}
      <Button
        variant="primary"
        size="sm"
        onClick={handleExportBackup}
        isLoading={downloadingAction === "backup"}
        leftIcon={<FileJson className="w-4 h-4" />}
      >
        Financial Backup JSON
      </Button>
    </div>
  );
}
