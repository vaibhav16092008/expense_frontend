import { useQuery } from "@tanstack/react-query";
import {
  getBudgetReport,
  getCashFlowReport,
  getCategoryReport,
  getCustomReport,
  getFinancialSummaryReport,
  getSavingsReport,
} from "../api";
import {
  CashFlowQueryParams,
  CustomReportQueryParams,
  DateRangeParams,
  SavingsQueryParams,
} from "../types";

export const REPORTS_QUERY_KEY = ["reports"];

export function useFinancialSummaryReport(params: DateRangeParams) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "summary", params],
    queryFn: () => getFinancialSummaryReport(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCashFlowReport(params: CashFlowQueryParams) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "cash-flow", params],
    queryFn: () => getCashFlowReport(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCategoryReport(params: DateRangeParams) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "categories", params],
    queryFn: () => getCategoryReport(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 2 * 60 * 1000,
  });
}

export function useBudgetReport(params: DateRangeParams) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "budgets", params],
    queryFn: () => getBudgetReport(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSavingsReport(params: SavingsQueryParams) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "savings", params],
    queryFn: () => getSavingsReport(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCustomReport(params: CustomReportQueryParams) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "custom", params],
    queryFn: () => getCustomReport(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 2 * 60 * 1000,
  });
}
