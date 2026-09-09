import apiClient from "@/lib/api/client";
import {
  AddContributionPayload,
  CreateGoalPayload,
  Goal,
  GoalContribution,
  GoalFilters,
  GoalSummary,
  PaginatedGoalsResponse,
  UpdateGoalPayload,
} from "../types";

export const getGoalSummary = async (): Promise<GoalSummary> => {
  const response = await apiClient.get("/goals/summary");
  return response.data?.data ?? response.data;
};

export const getGoals = async (
  filters: GoalFilters = {}
): Promise<PaginatedGoalsResponse> => {
  const cleanParams: Record<string, unknown> = {};
  if (filters.page) cleanParams.page = filters.page;
  if (filters.limit) cleanParams.limit = filters.limit;
  if (filters.status) cleanParams.status = filters.status;
  if (filters.search) cleanParams.search = filters.search;
  if (filters.hasDeadline) cleanParams.hasDeadline = filters.hasDeadline;
  if (filters.sortBy) cleanParams.sortBy = filters.sortBy;
  if (filters.sortOrder) cleanParams.sortOrder = filters.sortOrder;

  const response = await apiClient.get("/goals", { params: cleanParams });
  const raw = response.data;

  const items: Goal[] = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  const pagination = raw?.pagination ?? {
    totalItems: items.length,
    totalPages: 1,
    currentPage: filters.page ?? 1,
    itemsPerPage: filters.limit ?? 10,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return {
    data: items,
    pagination,
  };
};

export const getGoalById = async (id: string): Promise<Goal> => {
  const response = await apiClient.get(`/goals/${id}`);
  return response.data?.data ?? response.data;
};

export const createGoal = async (
  payload: CreateGoalPayload
): Promise<Goal> => {
  const response = await apiClient.post("/goals", payload);
  return response.data?.data ?? response.data;
};

export const updateGoal = async (
  id: string,
  payload: UpdateGoalPayload
): Promise<Goal> => {
  const response = await apiClient.patch(`/goals/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await apiClient.delete(`/goals/${id}`);
};

export const pauseGoal = async (id: string): Promise<Goal> => {
  const response = await apiClient.post(`/goals/${id}/pause`);
  return response.data?.data ?? response.data;
};

export const resumeGoal = async (id: string): Promise<Goal> => {
  const response = await apiClient.post(`/goals/${id}/resume`);
  return response.data?.data ?? response.data;
};

export const completeGoal = async (id: string): Promise<Goal> => {
  const response = await apiClient.post(`/goals/${id}/complete`);
  return response.data?.data ?? response.data;
};

export const addContribution = async (
  goalId: string,
  payload: AddContributionPayload
): Promise<{ contribution: GoalContribution; goal: Goal }> => {
  const response = await apiClient.post(`/goals/${goalId}/contributions`, payload);
  return response.data?.data ?? response.data;
};

export const getContributions = async (
  goalId: string
): Promise<GoalContribution[]> => {
  const response = await apiClient.get(`/goals/${goalId}/contributions`);
  const raw = response.data;
  return Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
};

export const deleteContribution = async (
  goalId: string,
  contributionId: string
): Promise<Goal> => {
  const response = await apiClient.delete(
    `/goals/${goalId}/contributions/${contributionId}`
  );
  return response.data?.data ?? response.data;
};
