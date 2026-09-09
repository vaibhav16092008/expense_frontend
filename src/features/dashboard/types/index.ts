export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  incomeChange?: number;
  expenseChange?: number;
  savingsChange?: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings?: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  color?: string;
  icon?: string;
  amount: number;
  percentage: number;
}

export interface SpendingTrend {
  date: string;
  amount: number;
}

export interface BudgetOverview {
  totalBudgeted: number;
  totalSpent: number;
  remaining: number;
  categoriesOverBudgetCount: number;
  items?: Array<{
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    percentage: number;
  }>;
}

export interface GoalSummary {
  totalGoals: number;
  totalTarget: number;
  totalCurrent: number;
  overallProgress: number;
  goals?: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    percentage: number;
    targetDate?: string;
  }>;
}
