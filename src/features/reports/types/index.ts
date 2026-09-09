export type ReportGroupBy = "day" | "week" | "month";

export type CustomReportGroupBy = "day" | "week" | "month" | "category";

export type ReportType = "summary" | "cash-flow" | "categories" | "budgets" | "savings";

export interface DateRangeParams {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export interface CashFlowQueryParams extends DateRangeParams {
  groupBy?: ReportGroupBy;
}

export interface SavingsQueryParams extends DateRangeParams {
  groupBy?: ReportGroupBy;
}

export interface CustomReportQueryParams extends DateRangeParams {
  groupBy?: CustomReportGroupBy;
}

export interface FinancialSummaryData {
  dateRange: DateRangeParams;
  totalIncome: string;
  totalExpense: string;
  savings: string;
  savingsRate: number;
}

export interface CashFlowItem {
  period: string;
  income: string;
  expense: string;
  net: string;
}

export interface CashFlowReportData {
  dateRange: DateRangeParams;
  groupBy: ReportGroupBy;
  data: CashFlowItem[];
}

export interface CategoryReportItem {
  categoryId: string;
  categoryName: string;
  amount: string;
  percentage: number;
}

export interface CategoryReportData {
  dateRange: DateRangeParams;
  totalExpense: string;
  data: CategoryReportItem[];
}

export interface BudgetReportItem {
  budgetId: string;
  name: string;
  type: "OVERALL" | "CATEGORY";
  period: "WEEKLY" | "MONTHLY" | "CUSTOM";
  startDate: string;
  endDate: string;
  amount: string;
  spent: string;
  remaining: string;
  percentageUsed: number;
  status: "ON_TRACK" | "WARNING" | "EXCEEDED";
}

export interface BudgetReportData {
  dateRange: DateRangeParams;
  totalBudgets: number;
  budgets: BudgetReportItem[];
}

export interface SavingsBreakdownItem {
  period: string;
  income: string;
  expense: string;
  savings: string;
}

export interface SavingsReportData {
  dateRange: DateRangeParams;
  groupBy: ReportGroupBy;
  totalIncome: string;
  totalExpense: string;
  totalSavings: string;
  savingsRate: number;
  breakdown: SavingsBreakdownItem[];
}

export type CustomReportData =
  | ({ type: "CATEGORY_BREAKDOWN" } & CategoryReportData)
  | ({ type: "PERIOD_BREAKDOWN" } & CashFlowReportData);

export interface ExportTransactionsParams {
  from?: string;
  to?: string;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
}

export interface ExportReportParams {
  type: ReportType;
  from: string;
  to: string;
  groupBy?: ReportGroupBy;
}
