import apiClient from "@/lib/api/client";
import {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionListResponse,
  UpdateTransactionPayload,
} from "../types";

export const getTransactions = async (
  filters: TransactionFilters = {}
): Promise<TransactionListResponse> => {
  const cleanParams: Record<string, unknown> = {};
  if (filters.page) cleanParams.page = filters.page;
  if (filters.limit) cleanParams.limit = filters.limit;
  if (filters.type) cleanParams.type = filters.type;
  if (filters.categoryId) cleanParams.categoryId = filters.categoryId;
  if (filters.startDate) cleanParams.startDate = filters.startDate;
  if (filters.endDate) cleanParams.endDate = filters.endDate;
  if (filters.search) cleanParams.search = filters.search;

  const response = await apiClient.get("/transactions", { params: cleanParams });
  const raw = response.data;

  // Defensive normalization
  const items = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw)
    ? raw
    : [];

  const meta = raw?.meta ?? {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    total: raw?.total ?? items.length,
    totalPages: raw?.totalPages ?? Math.max(1, Math.ceil((raw?.total ?? items.length) / (filters.limit ?? 10))),
  };

  return {
    data: items,
    meta: {
      page: Number(meta.page) || 1,
      limit: Number(meta.limit) || 10,
      total: Number(meta.total) || 0,
      totalPages: Number(meta.totalPages) || 1,
    },
  };
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await apiClient.get(`/transactions/${id}`);
  return response.data?.data ?? response.data;
};

export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  const response = await apiClient.post("/transactions", payload);
  return response.data?.data ?? response.data;
};

export const updateTransaction = async (
  id: string,
  payload: UpdateTransactionPayload
): Promise<Transaction> => {
  const response = await apiClient.patch(`/transactions/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await apiClient.delete(`/transactions/${id}`);
};

export const exportTransactions = async (filters: TransactionFilters = {}): Promise<Blob> => {
  const response = await apiClient.get("/transactions/export", {
    params: filters,
    responseType: "blob",
  });
  return response.data;
};
