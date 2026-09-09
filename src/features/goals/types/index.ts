export type GoalStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "OVERDUE";
export type DerivedStatus = "PAUSED" | "COMPLETED" | "NOT_STARTED" | "OVERDUE" | "AT_RISK" | "ON_TRACK";
export type ContributionType = "MANUAL" | "ADJUSTMENT";

export interface Goal {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  targetAmount: string;
  currentAmount: string;
  deadline: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  remainingAmount: string;
  progressPercentage: number;
  daysRemaining: number | null;
  derivedStatus: DerivedStatus;
}

export interface GoalSummary {
  totalGoals: number;
  activeGoals: number;
  pausedGoals: number;
  completedGoals: number;
  overdueGoals: number;
  totalTargetAmount: string;
  totalCurrentAmount: string;
  totalRemainingAmount: string;
  overallProgressPercentage: number;
  nearestDeadline: string | null;
  topGoal: {
    id: string;
    name: string;
    progressPercentage: number;
  } | null;
}

export interface GoalContribution {
  id: string;
  amount: string;
  note: string | null;
  type: ContributionType;
  goalId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalPayload {
  name: string;
  description?: string;
  targetAmount: string;
  deadline?: string;
}

export type UpdateGoalPayload = Partial<CreateGoalPayload>;

export interface AddContributionPayload {
  amount: string;
  note?: string;
  type?: ContributionType;
}

export interface GoalFilters {
  status?: GoalStatus;
  search?: string;
  hasDeadline?: string;
  sortBy?: "createdAt" | "deadline" | "targetAmount" | "currentAmount" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedGoalsResponse {
  data: Goal[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
