// src/utils/offline.ts
import NetInfo from "@react-native-community/netinfo";
import { queryClient } from "../lib/queryClient";

// React Query handles most of this automatically via staleTime + cacheTime.
// For mutations that need to survive offline, use a simple queue:

export const offlineQueue: QueuedMutation[] = [];

export async function syncOfflineQueue() {
  const { isConnected } = await NetInfo.fetch();
  if (!isConnected || offlineQueue.length === 0) return;

  for (const mutation of [...offlineQueue]) {
    try {
      await mutation.execute();
      offlineQueue.splice(offlineQueue.indexOf(mutation), 1);
    } catch {
      // Leave in queue for next sync attempt
    }
  }
}

// React Query config for offline-first:
// queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 60 * 24, // 24 hr cache
      retry: (failureCount, error) =>
        failureCount < 3 && !isNetworkError(error),
    },
  },
});
