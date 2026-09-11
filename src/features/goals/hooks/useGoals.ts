import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addContribution,
  completeGoal,
  createGoal,
  deleteContribution,
  deleteGoal,
  getGoalById,
  getGoals,
  getGoalSummary,
  pauseGoal,
  resumeGoal,
  updateGoal,
  getContributions,
} from "../api";
import {
  AddContributionPayload,
  CreateGoalPayload,
  GoalFilters,
  UpdateGoalPayload,
} from "../types";

export const GOALS_QUERY_KEY = ["goals"];

export function useGoalSummary() {
  return useQuery({
    queryKey: [...GOALS_QUERY_KEY, "summary"],
    queryFn: getGoalSummary,
    staleTime: 1 * 60 * 1000,
  });
}

export function useGoals(filters: GoalFilters = {}) {
  return useQuery({
    queryKey: [...GOALS_QUERY_KEY, filters],
    queryFn: () => getGoals(filters),
    staleTime: 1 * 60 * 1000,
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: [...GOALS_QUERY_KEY, id],
    queryFn: () => getGoalById(id),
    enabled: Boolean(id),
  });
}

export function useContributions(goalId: string) {
  return useQuery({
    queryKey: [...GOALS_QUERY_KEY, goalId, "contributions"],
    queryFn: () => getContributions(goalId),
    enabled: Boolean(goalId),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
      updateGoal(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function usePauseGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pauseGoal(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useResumeGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeGoal(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useCompleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeGoal(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useAddContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      goalId,
      payload,
    }: {
      goalId: string;
      payload: AddContributionPayload;
    }) => addContribution(goalId, payload),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, goalId] });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, "summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({
        queryKey: [...GOALS_QUERY_KEY, goalId, "contributions"],
      });
    },
  });
}

export function useDeleteContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      goalId,
      contributionId,
    }: {
      goalId: string;
      contributionId: string;
    }) => deleteContribution(goalId, contributionId),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, goalId] });
      queryClient.invalidateQueries({ queryKey: [...GOALS_QUERY_KEY, "summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({
        queryKey: [...GOALS_QUERY_KEY, goalId, "contributions"],
      });
    },
  });
}
