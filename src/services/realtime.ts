import { io, type Socket } from 'socket.io-client';

export interface SyncEvent {
  resource: 'projects' | 'investments' | 'payments';
  action: 'created' | 'updated' | 'deleted' | 'verified';
  id?: string;
  projectId?: string;
  timestamp: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || apiBaseUrl.replace(/\/api\/?$/, '') || 'http://localhost:5000';

let socket: Socket | null = null;

export function getRealtimeSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  return socket;
}

export function subscribeToSync(handler: (event: SyncEvent) => void) {
  const activeSocket = getRealtimeSocket();
  activeSocket.on('sync:update', handler);

  return () => {
    activeSocket.off('sync:update', handler);
  };
}
