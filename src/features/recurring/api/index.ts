import apiClient from "@/lib/api/client";
import {
  CreateRecurringTransactionPayload,
  Pagination,
  RecurringFilters,
  RecurringTransaction,
  RecurringTransactionListResponse,
  UpdateRecurringTransactionPayload,
} from "../types";

export const getRecurringTransactions = async (
  filters: RecurringFilters = {}
): Promise<RecurringTransactionListResponse> => {
  const cleanParams: Record<string, unknown> = {};

  if (filters.page !== undefined) cleanParams.page = filters.page;
  if (filters.limit !== undefined) cleanParams.limit = filters.limit;
  if (filters.active !== undefined) cleanParams.active = filters.active;
  if (filters.type) cleanParams.type = filters.type;
  if (filters.frequency) cleanParams.frequency = filters.frequency;
  if (filters.categoryId) cleanParams.categoryId = filters.categoryId;
  if (filters.startDate) cleanParams.startDate = filters.startDate;
  if (filters.endDate) cleanParams.endDate = filters.endDate;
  if (filters.sortBy) cleanParams.sortBy = filters.sortBy;
  if (filters.sortOrder) cleanParams.sortOrder = filters.sortOrder;

  const response = await apiClient.get("/recurring-transactions", {
    params: cleanParams,
  });
  const raw = response.data;

  const items = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  const rawPagination = raw?.pagination ?? {};
  const pagination: Pagination = {
    page: Number(rawPagination.page) || filters.page || 1,
    limit: Number(rawPagination.limit) || filters.limit || 20,
    totalCount: Number(rawPagination.totalCount) || items.length,
    totalPages: Number(rawPagination.totalPages) || 1,
    hasMore: Boolean(rawPagination.hasMore),
  };

  return {
    data: items,
    pagination,
  };
};

export const getRecurringTransactionById = async (
  id: string
): Promise<RecurringTransaction> => {
  const response = await apiClient.get(`/recurring-transactions/${id}`);
  return response.data?.data ?? response.data;
};

export const createRecurringTransaction = async (
  payload: CreateRecurringTransactionPayload
): Promise<RecurringTransaction> => {
  const response = await apiClient.post("/recurring-transactions", payload);
  return response.data?.data ?? response.data;
};

export const updateRecurringTransaction = async (
  id: string,
  payload: UpdateRecurringTransactionPayload
): Promise<RecurringTransaction> => {
  const response = await apiClient.patch(
    `/recurring-transactions/${id}`,
    payload
  );
  return response.data?.data ?? response.data;
};

export const deleteRecurringTransaction = async (
  id: string
): Promise<void> => {
  await apiClient.delete(`/recurring-transactions/${id}`);
};

export const pauseRecurringTransaction = async (
  id: string
): Promise<RecurringTransaction> => {
  const response = await apiClient.post(
    `/recurring-transactions/${id}/pause`
  );
  return response.data?.data ?? response.data;
};

export const resumeRecurringTransaction = async (
  id: string
): Promise<RecurringTransaction> => {
  const response = await apiClient.post(
    `/recurring-transactions/${id}/resume`
  );
  return response.data?.data ?? response.data;
};
