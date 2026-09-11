/**
 * Offline-Aware Transaction Service
 * Manages transaction creation by orchestrating online Axios requests vs IndexedDB queue persistence.
 */

import { normalizeApiError } from "@/lib/api/errors";
import { transactionQueueStore, QueuedTransactionPayload } from "@/lib/offline";
import { notifyQueueChanged } from "@/hooks/useOfflineQueueStatus";
import { createTransaction } from "../api";
import { CreateTransactionPayload, Transaction } from "../types";

export interface CreateTransactionResult {
  transaction: Transaction;
  isOffline: boolean;
  isNetworkFailure?: boolean;
}

/**
 * Generate a unique UUID v4 using crypto.randomUUID() with fallback
 */
export function generateClientRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Standard UUID v4 fallback format
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Perform offline-aware transaction creation
 */
export async function createTransactionOfflineAware(
  payload: CreateTransactionPayload,
  userId: string = "anonymous"
): Promise<CreateTransactionResult> {
  // 1. Generate clientRequestId EXACTLY ONCE if not provided
  const clientRequestId = payload.clientRequestId || generateClientRequestId();
  const payloadWithClientRequestId: CreateTransactionPayload = {
    ...payload,
    clientRequestId,
  };

  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

  // 2. OFFLINE FLOW: Save directly to IndexedDB
  if (!isOnline) {
    await transactionQueueStore.enqueueTransaction({
      id: clientRequestId,
      clientRequestId,
      userId,
      operation: "CREATE_TRANSACTION",
      payload: payloadWithClientRequestId as unknown as QueuedTransactionPayload,
      status: "PENDING",
      retryCount: 0,
    });

    notifyQueueChanged();

    const pendingTransaction: Transaction = {
      id: clientRequestId,
      amount: payload.amount,
      type: payload.type,
      categoryId: payload.categoryId,
      date: payload.date,
      merchant: payload.merchant,
      note: payload.note,
      clientRequestId,
      isPendingSync: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      transaction: pendingTransaction,
      isOffline: true,
    };
  }

  // 3. ONLINE FLOW: Attempt sending to backend API via Axios
  try {
    const serverTransaction = await createTransaction(payloadWithClientRequestId);
    return {
      transaction: serverTransaction,
      isOffline: false,
    };
  } catch (rawError) {
    const error = normalizeApiError(rawError);

    // If request failed because of transient network connectivity loss
    if (error.isNetworkError) {
      await transactionQueueStore.enqueueTransaction({
        id: clientRequestId,
        clientRequestId,
        userId,
        operation: "CREATE_TRANSACTION",
        payload: payloadWithClientRequestId as unknown as QueuedTransactionPayload,
        status: "PENDING",
        retryCount: 0,
      });

      notifyQueueChanged();

      const pendingTransaction: Transaction = {
        id: clientRequestId,
        amount: payload.amount,
        type: payload.type,
        categoryId: payload.categoryId,
        date: payload.date,
        merchant: payload.merchant,
        note: payload.note,
        clientRequestId,
        isPendingSync: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        transaction: pendingTransaction,
        isOffline: true,
        isNetworkFailure: true,
      };
    }

    // Client/Validation errors (400, 403, 404) should NOT be queued
    throw error;
  }
}
