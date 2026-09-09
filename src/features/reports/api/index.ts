import apiClient from "@/lib/api/client";
import {
  BudgetReportData,
  CashFlowQueryParams,
  CashFlowReportData,
  CategoryReportData,
  CustomReportQueryParams,
  CustomReportData,
  DateRangeParams,
  ExportReportParams,
  ExportTransactionsParams,
  FinancialSummaryData,
  SavingsQueryParams,
  SavingsReportData,
} from "../types";

export const getFinancialSummaryReport = async (
  params: DateRangeParams
): Promise<FinancialSummaryData> => {
  const response = await apiClient.get("/reports/summary", { params });
  return response.data?.data ?? response.data;
};

export const getCashFlowReport = async (
  params: CashFlowQueryParams
): Promise<CashFlowReportData> => {
  const response = await apiClient.get("/reports/cash-flow", { params });
  return response.data?.data ?? response.data;
};

export const getCategoryReport = async (
  params: DateRangeParams
): Promise<CategoryReportData> => {
  const response = await apiClient.get("/reports/categories", { params });
  return response.data?.data ?? response.data;
};

export const getBudgetReport = async (
  params: DateRangeParams
): Promise<BudgetReportData> => {
  const response = await apiClient.get("/reports/budgets", { params });
  return response.data?.data ?? response.data;
};

export const getSavingsReport = async (
  params: SavingsQueryParams
): Promise<SavingsReportData> => {
  const response = await apiClient.get("/reports/savings", { params });
  return response.data?.data ?? response.data;
};

export const getCustomReport = async (
  params: CustomReportQueryParams
): Promise<CustomReportData> => {
  const response = await apiClient.get("/reports/custom", { params });
  return response.data?.data ?? response.data;
};

// ---------------------------------------------------------------------------
// Export API Functions
// ---------------------------------------------------------------------------

function extractFilename(contentDisposition?: string, fallback: string = "download"): string {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
  return match?.[1] ? match[1] : fallback;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export const downloadTransactionsCsv = async (
  params: ExportTransactionsParams = {}
): Promise<void> => {
  const cleanParams: Record<string, unknown> = {};
  if (params.from) cleanParams.from = params.from;
  if (params.to) cleanParams.to = params.to;
  if (params.type) cleanParams.type = params.type;
  if (params.categoryId) cleanParams.categoryId = params.categoryId;

  const response = await apiClient.get("/exports/transactions", {
    params: cleanParams,
    responseType: "blob",
  });

  const today = new Date().toISOString().split("T")[0];
  const filename = extractFilename(
    response.headers["content-disposition"],
    `expenseiq_transactions_${today}.csv`
  );

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  triggerBlobDownload(blob, filename);
};

export const downloadReportCsv = async (
  params: ExportReportParams
): Promise<void> => {
  const cleanParams: Record<string, unknown> = {
    type: params.type,
    from: params.from,
    to: params.to,
  };
  if (params.groupBy) cleanParams.groupBy = params.groupBy;

  const response = await apiClient.get("/exports/reports", {
    params: cleanParams,
    responseType: "blob",
  });

  const today = new Date().toISOString().split("T")[0];
  const filename = extractFilename(
    response.headers["content-disposition"],
    `expenseiq_report_${params.type}_${today}.csv`
  );

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  triggerBlobDownload(blob, filename);
};

export const downloadFinancialBackupJson = async (): Promise<void> => {
  const response = await apiClient.get("/exports/financial", {
    responseType: "blob",
  });

  const today = new Date().toISOString().split("T")[0];
  const filename = extractFilename(
    response.headers["content-disposition"],
    `expenseiq_financial_backup_${today}.json`
  );

  const blob = new Blob([response.data], { type: "application/json" });
  triggerBlobDownload(blob, filename);
};
