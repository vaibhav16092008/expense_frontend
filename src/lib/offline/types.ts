/**
 * ExpenseIQ Offline IndexedDB Architecture Types
 * Strictly defined schemas for client-side transaction queuing.
 */

export type QueueItemStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export interface QueuedTransactionPayload {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  description?: string;
  date: string;
  merchant?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface QueuedTransaction {
  id: string; // Unique Queue Item ID
  clientRequestId: string; // Idempotency UUID generated ONCE
  userId: string; // Authenticated User ID
  operation: 'CREATE_TRANSACTION';
  payload: QueuedTransactionPayload;
  status: QueueItemStatus;
  retryCount: number;
  createdAt: number;
  updatedAt: number;
  lastAttemptedAt?: number;
  errorMessage?: string;
  errorCode?: string;
}

export interface QueueQueryFilter {
  userId?: string;
  status?: QueueItemStatus;
}
