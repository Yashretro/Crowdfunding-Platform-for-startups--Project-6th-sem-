import { useEffect, useRef } from 'react';
import type { SyncEvent } from '../services/realtime';
import { subscribeToSync } from '../services/realtime';

type SyncFilter = SyncEvent['resource'] | SyncEvent['resource'][];

export function useRealtimeSync(
  filter: SyncFilter | undefined,
  callback: (event: SyncEvent) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const resources = Array.isArray(filter) ? filter : filter ? [filter] : null;

    return subscribeToSync((event) => {
      if (!resources || resources.includes(event.resource)) {
        callbackRef.current(event);
      }
    });
  }, [filter]);
}
