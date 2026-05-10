import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "fitcoach_offline_queue";

export type QueuedMutation = {
  id:        string;
  type:      string;
  payload:   unknown;
  createdAt: string;
};

export async function enqueueOfflineMutation(
  type: string,
  payload: unknown
): Promise<void> {
  const existing = await getQueue();
  const updated: QueuedMutation[] = [
    ...existing,
    {
      id:        `q_${Date.now()}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
    },
  ];
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
}

export async function getQueue(): Promise<QueuedMutation[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? (JSON.parse(raw) as QueuedMutation[]) : [];
}

export async function removeFromQueue(id: string): Promise<void> {
  const existing = await getQueue();
  const updated  = existing.filter((m) => m.id !== id);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
}

/**
 * Call this when the app comes back online.
 * Pass a handler map: { [type]: async (payload) => void }
 */
export async function syncOfflineQueue(
  handlers: Record<string, (payload: unknown) => Promise<void>>
): Promise<void> {
  const { isConnected } = await NetInfo.fetch();
  if (!isConnected) return;

  const queue = await getQueue();
  if (queue.length === 0) return;

  for (const mutation of queue) {
    const handler = handlers[mutation.type];
    if (!handler) continue;

    try {
      await handler(mutation.payload);
      await removeFromQueue(mutation.id);
    } catch (err) {
      console.warn(`Offline sync failed for ${mutation.type}:`, err);
      // Leave in queue — will retry next time
    }
  }
}
