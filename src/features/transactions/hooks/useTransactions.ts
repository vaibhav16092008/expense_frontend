import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import {
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../api";
import { createTransactionOfflineAware } from "../services/offlineTransactionService";
import {
  CreateTransactionPayload,
  TransactionFilters,
  UpdateTransactionPayload,
} from "../types";

export const TRANSACTIONS_QUERY_KEY = ["transactions"];

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, filters],
    queryFn: () => getTransactions(filters),
    staleTime: 1 * 60 * 1000,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, id],
    queryFn: () => getTransaction(id),
    enabled: Boolean(id),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransactionOfflineAware(payload, user?.id || "anonymous"),
    onSuccess: (result) => {
      if (!result.isOffline) {
        queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
