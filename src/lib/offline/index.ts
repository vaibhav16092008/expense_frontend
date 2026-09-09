/**
 * Offline Sync Engine Abstraction Point (Prepared for Phase F5)
 * Establishes contract for local persistence, offline queueing, and sync state.
 */

export interface OfflineAction<T = unknown> {
  id: string;
  type: string;
  payload: T;
  createdAt: number;
  retryCount: number;
}

export interface SyncEngineStatus {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncedAt?: number;
}

export class OfflineStorageEngine {
  private static instance: OfflineStorageEngine;

  private constructor() {}

  public static getInstance(): OfflineStorageEngine {
    if (!OfflineStorageEngine.instance) {
      OfflineStorageEngine.instance = new OfflineStorageEngine();
    }
    return OfflineStorageEngine.instance;
  }

  public isOnline(): boolean {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  }

  public async getPendingQueue(): Promise<OfflineAction[]> {
    // Abstract queue getter for IndexedDB/Storage
    return [];
  }

  public async enqueueAction<T>(type: string, payload: T): Promise<OfflineAction<T>> {
    const action: OfflineAction<T> = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
    };
    return action;
  }
}
