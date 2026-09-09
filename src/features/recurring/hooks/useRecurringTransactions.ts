import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactionById,
  getRecurringTransactions,
  pauseRecurringTransaction,
  resumeRecurringTransaction,
  updateRecurringTransaction,
} from "../api";
import {
  CreateRecurringTransactionPayload,
  RecurringFilters,
  UpdateRecurringTransactionPayload,
} from "../types";

export const RECURRING_TRANSACTIONS_QUERY_KEY = ["recurring-transactions"];
export const TRANSACTIONS_QUERY_KEY = ["transactions"];

export function useRecurringTransactions(filters: RecurringFilters = {}) {
  return useQuery({
    queryKey: [...RECURRING_TRANSACTIONS_QUERY_KEY, filters],
    queryFn: () => getRecurringTransactions(filters),
  });
}

export function useRecurringTransaction(id: string) {
  return useQuery({
    queryKey: [...RECURRING_TRANSACTIONS_QUERY_KEY, id],
    queryFn: () => getRecurringTransactionById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRecurringTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecurringTransactionPayload) =>
      createRecurringTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRecurringTransactionPayload;
    }) => updateRecurringTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecurringTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function usePauseRecurringTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pauseRecurringTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function useResumeRecurringTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeRecurringTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}
