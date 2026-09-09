import apiClient from "@/lib/api/client";
import {
  Budget,
  BudgetFilters,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from "../types";

export const getBudgets = async (
  filters: BudgetFilters = {}
): Promise<Budget[]> => {
  const cleanParams: Record<string, unknown> = {};
  if (filters.type) cleanParams.type = filters.type;
  if (filters.period) cleanParams.period = filters.period;
  if (filters.categoryId) cleanParams.categoryId = filters.categoryId;
  if (filters.startDate) cleanParams.startDate = filters.startDate;
  if (filters.endDate) cleanParams.endDate = filters.endDate;
  if (filters.status) cleanParams.status = filters.status;

  const response = await apiClient.get("/budgets", { params: cleanParams });
  const raw = response.data;

  // Defensive normalization
  const items = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  return items;
};

export const getBudgetById = async (id: string): Promise<Budget> => {
  const response = await apiClient.get(`/budgets/${id}`);
  return response.data?.data ?? response.data;
};

export const createBudget = async (
  payload: CreateBudgetPayload
): Promise<Budget> => {
  const response = await apiClient.post("/budgets", payload);
  return response.data?.data ?? response.data;
};

export const updateBudget = async (
  id: string,
  payload: UpdateBudgetPayload
): Promise<Budget> => {
  const response = await apiClient.patch(`/budgets/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await apiClient.delete(`/budgets/${id}`);
};
