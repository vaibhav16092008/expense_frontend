export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type TransactionType = "EXPENSE" | "INCOME";

export interface RecurringCategory {
  id: string;
  name: string;
  type: TransactionType;
}

export interface RecurringTransaction {
  id: string;
  amount: string;
  type: TransactionType;
  frequency: RecurringFrequency;
  note: string | null;
  startDate: string;
  nextRunAt: string;
  endDate: string | null;
  active: boolean;
  category: RecurringCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringTransactionPayload {
  amount: string;
  type: TransactionType;
  categoryId: string;
  note?: string;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string | null;
}

export interface UpdateRecurringTransactionPayload {
  amount?: string;
  type?: TransactionType;
  categoryId?: string;
  note?: string | null;
  frequency?: RecurringFrequency;
  startDate?: string;
  endDate?: string | null;
  active?: boolean;
}

export interface RecurringFilters {
  page?: number;
  limit?: number;
  active?: boolean;
  type?: TransactionType;
  frequency?: RecurringFrequency;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "nextRunAt" | "createdAt" | "amount";
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export interface RecurringTransactionListResponse {
  data: RecurringTransaction[];
  pagination: Pagination;
}
