import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
} from "../api";
import {
  BudgetFilters,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from "../types";

export const BUDGETS_QUERY_KEY = ["budgets"];

export function useBudgets(filters: BudgetFilters = {}) {
  return useQuery({
    queryKey: [...BUDGETS_QUERY_KEY, filters],
    queryFn: () => getBudgets(filters),
    staleTime: 1 * 60 * 1000,
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: [...BUDGETS_QUERY_KEY, id],
    queryFn: () => getBudgetById(id),
    enabled: Boolean(id),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "budget-overview"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBudgetPayload }) =>
      updateBudget(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "budget-overview"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "budget-overview"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
