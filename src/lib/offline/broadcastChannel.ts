/**
 * ExpenseIQ Cross-Tab BroadcastChannel Notification Abstraction
 * Handles lightweight cross-tab UI notifications (QUEUE_CHANGED, SYNC_COMPLETED, etc.)
 * Strictly for UX notifications — NOT for data transfer or sync execution.
 */

export type BroadcastEventType =
  | "QUEUE_CHANGED"
  | "SYNC_STARTED"
  | "SYNC_COMPLETED"
  | "SYNC_FAILED"
  | "AUTH_STATE_CHANGED";

export interface BroadcastEventMessage {
  type: BroadcastEventType;
  timestamp: number;
  count?: number;
}

const CHANNEL_NAME = "expenseiq_tab_channel";

let activeChannel: BroadcastChannel | null = null;
const listeners = new Set<(event: BroadcastEventMessage) => void>();

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  if (!activeChannel) {
    try {
      activeChannel = new BroadcastChannel(CHANNEL_NAME);
      activeChannel.onmessage = (evt: MessageEvent<BroadcastEventMessage>) => {
        if (evt?.data && typeof evt.data.type === "string") {
          listeners.forEach((listener) => {
            try {
              listener(evt.data);
            } catch (err) {
              console.warn("[ExpenseIQ BroadcastChannel] Listener error:", err);
            }
          });
        }
      };
    } catch (err) {
      console.warn("[ExpenseIQ BroadcastChannel] Failed to create channel:", err);
      activeChannel = null;
    }
  }

  return activeChannel;
}

/**
 * Publishes a lightweight notification to other open browser tabs.
 */
export function publishBroadcastEvent(
  event: Omit<BroadcastEventMessage, "timestamp"> & { timestamp?: number }
): void {
  const channel = getChannel();
  if (!channel) return;

  const payload: BroadcastEventMessage = {
    type: event.type,
    timestamp: event.timestamp || Date.now(),
    count: event.count,
  };

  try {
    channel.postMessage(payload);
  } catch (err) {
    console.warn("[ExpenseIQ BroadcastChannel] Failed to post message:", err);
  }
}

/**
 * Subscribes to cross-tab notifications.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeBroadcastChannel(
  callback: (event: BroadcastEventMessage) => void
): () => void {
  listeners.add(callback);
  getChannel(); // Ensure channel is initialized

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && activeChannel) {
      try {
        activeChannel.close();
      } catch {
        // Ignore close errors
      }
      activeChannel = null;
    }
  };
}
