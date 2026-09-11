"use client";

import { useSyncEngine } from "@/lib/offline/useSyncEngine";

/**
 * Client component mounted in AuthProvider context to run automatic offline transaction sync
 */
export function SyncEngineInitializer() {
  useSyncEngine();
  return null;
}
