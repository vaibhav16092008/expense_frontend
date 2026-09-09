export type BudgetType = "OVERALL" | "CATEGORY";
export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "CUSTOM";
export type BudgetStatus = "ON_TRACK" | "WARNING" | "CRITICAL" | "EXCEEDED";

export interface BudgetCategory {
  id: string;
  name: string;
  type: "EXPENSE" | "INCOME";
}

export interface Budget {
  id: string;
  amount: string;
  type: BudgetType;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  category: BudgetCategory | null;
  spent: string;
  remaining: string;
  percentage: number;
  status: BudgetStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetPayload {
  amount: string;
  type: BudgetType;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  categoryId?: string | null;
}

export type UpdateBudgetPayload = Partial<CreateBudgetPayload>;

export interface BudgetFilters {
  type?: BudgetType;
  period?: BudgetPeriod;
  categoryId?: string;
  status?: BudgetStatus;
  startDate?: string;
  endDate?: string;
}
