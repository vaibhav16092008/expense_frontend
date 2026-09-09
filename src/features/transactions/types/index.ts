import { Category, CategoryType } from "@/features/categories/types";

export type { CategoryType };
export type TransactionType = CategoryType;

export interface Transaction {
  id: string;
  amount: number;
  type: CategoryType;
  categoryId: string;
  category?: Category;
  date: string;
  note?: string;
  merchant?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: CategoryType | "";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTransactionPayload {
  amount: number;
  type: CategoryType;
  categoryId: string;
  date: string;
  note?: string;
  merchant?: string;
}

export interface UpdateTransactionPayload {
  amount?: number;
  type?: CategoryType;
  categoryId?: string;
  date?: string;
  note?: string;
  merchant?: string;
}
