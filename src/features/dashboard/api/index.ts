import apiClient from "@/lib/api/client";
import {
  BudgetOverview,
  CategorySpending,
  DashboardSummary,
  GoalSummary,
  MonthlyData,
  SpendingTrend,
} from "../types";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await apiClient.get("/dashboard/summary");
    const raw = response.data?.data ?? response.data ?? {};
    return {
      totalIncome: Number(raw.totalIncome ?? raw.income ?? 0),
      totalExpenses: Number(raw.totalExpenses ?? raw.expenses ?? raw.expense ?? 0),
      netSavings: Number(raw.netSavings ?? raw.savings ?? (Number(raw.totalIncome ?? 0) - Number(raw.totalExpenses ?? 0))),
      savingsRate: Number(raw.savingsRate ?? (raw.totalIncome > 0 ? ((raw.totalIncome - raw.totalExpenses) / raw.totalIncome) * 100 : 0)),
      incomeChange: raw.incomeChange !== undefined ? Number(raw.incomeChange) : undefined,
      expenseChange: raw.expenseChange !== undefined ? Number(raw.expenseChange) : undefined,
      savingsChange: raw.savingsChange !== undefined ? Number(raw.savingsChange) : undefined,
    };
  } catch (error) {
    console.warn("Failed to fetch dashboard summary, using fallback", error);
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      savingsRate: 0,
    };
  }
};

export const getMonthlyData = async (months = 6): Promise<MonthlyData[]> => {
  try {
    const response = await apiClient.get("/dashboard/monthly", { params: { months } });
    const raw = response.data?.data ?? response.data;
    if (Array.isArray(raw)) {
      return raw.map((item) => ({
        month: String(item.month ?? item.date ?? item.label ?? ""),
        income: Number(item.income ?? item.totalIncome ?? 0),
        expense: Number(item.expense ?? item.expenses ?? item.totalExpenses ?? 0),
        savings: Number(item.savings ?? (Number(item.income ?? 0) - Number(item.expense ?? 0))),
      }));
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch monthly chart data", error);
    return [];
  }
};

export const getCategorySpending = async (): Promise<CategorySpending[]> => {
  try {
    const response = await apiClient.get("/dashboard/categories");
    const raw = response.data?.data ?? response.data;
    if (Array.isArray(raw)) {
      return raw.map((item) => ({
        categoryId: String(item.categoryId ?? item.id ?? ""),
        categoryName: String(item.categoryName ?? item.name ?? item.category ?? "Uncategorized"),
        color: item.color ?? item.categoryColor,
        icon: item.icon,
        amount: Number(item.amount ?? item.total ?? 0),
        percentage: Number(item.percentage ?? 0),
      }));
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch category spending", error);
    return [];
  }
};

export const getSpendingTrends = async (): Promise<SpendingTrend[]> => {
  try {
    const response = await apiClient.get("/dashboard/trends");
    const raw = response.data?.data ?? response.data;
    if (Array.isArray(raw)) {
      return raw.map((item) => ({
        date: String(item.date ?? item.day ?? ""),
        amount: Number(item.amount ?? item.total ?? 0),
      }));
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch spending trends", error);
    return [];
  }
};

export const getBudgetOverview = async (): Promise<BudgetOverview> => {
  try {
    const response = await apiClient.get("/dashboard/budget-overview");
    const raw = response.data?.data ?? response.data ?? {};
    return {
      totalBudgeted: Number(raw.totalBudgeted ?? 0),
      totalSpent: Number(raw.totalSpent ?? 0),
      remaining: Number(raw.remaining ?? (Number(raw.totalBudgeted ?? 0) - Number(raw.totalSpent ?? 0))),
      categoriesOverBudgetCount: Number(raw.categoriesOverBudgetCount ?? 0),
      items: Array.isArray(raw.items)
        ? raw.items.map((item: Record<string, unknown>) => ({
            categoryId: String(item.categoryId ?? item.id ?? ""),
            categoryName: String(item.categoryName ?? item.name ?? ""),
            budgeted: Number(item.budgeted ?? item.budget ?? 0),
            spent: Number(item.spent ?? 0),
            percentage: Number(item.percentage ?? 0),
          }))
        : [],
    };
  } catch (error) {
    console.warn("Failed to fetch budget overview", error);
    return {
      totalBudgeted: 0,
      totalSpent: 0,
      remaining: 0,
      categoriesOverBudgetCount: 0,
      items: [],
    };
  }
};

export const getGoalSummary = async (): Promise<GoalSummary> => {
  try {
    const response = await apiClient.get("/goals/summary");
    const raw = response.data?.data ?? response.data ?? {};
    return {
      totalGoals: Number(raw.totalGoals ?? 0),
      totalTarget: Number(raw.totalTarget ?? 0),
      totalCurrent: Number(raw.totalCurrent ?? 0),
      overallProgress: Number(raw.overallProgress ?? 0),
      goals: Array.isArray(raw.goals)
        ? raw.goals.map((item: Record<string, unknown>) => ({
            id: String(item.id ?? ""),
            name: String(item.name ?? ""),
            targetAmount: Number(item.targetAmount ?? 0),
            currentAmount: Number(item.currentAmount ?? 0),
            percentage: Number(item.percentage ?? 0),
            targetDate: item.targetDate ? String(item.targetDate) : undefined,
          }))
        : [],
    };
  } catch (error) {
    console.warn("Failed to fetch goal summary", error);
    return {
      totalGoals: 0,
      totalTarget: 0,
      totalCurrent: 0,
      overallProgress: 0,
      goals: [],
    };
  }
};
