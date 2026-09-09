import { useQuery } from "@tanstack/react-query";
import {
  getBudgetOverview,
  getCategorySpending,
  getDashboardSummary,
  getGoalSummary,
  getMonthlyData,
  getSpendingTrends,
} from "../api";

export const DASHBOARD_QUERY_KEY = ["dashboard"];

export function useDashboardSummary() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "summary"],
    queryFn: () => getDashboardSummary(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyData(months = 6) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "monthly", months],
    queryFn: () => getMonthlyData(months),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategorySpending() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "categories"],
    queryFn: () => getCategorySpending(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpendingTrends() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "trends"],
    queryFn: () => getSpendingTrends(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBudgetOverview() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "budget-overview"],
    queryFn: () => getBudgetOverview(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGoalSummary() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "goals-summary"],
    queryFn: () => getGoalSummary(),
    staleTime: 5 * 60 * 1000,
  });
}
