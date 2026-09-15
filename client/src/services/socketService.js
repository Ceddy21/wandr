import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

console.log('[socketService] Initializing. SOCKET_URL =', SOCKET_URL);

let socket = null;
const roomCounts = new Map();

export const getSocket = () => {
  console.log('[socketService] getSocket() called');
  if (!socket) {
    console.log('[socketService] Creating new socket connection to', SOCKET_URL);
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[socketService] Connected! socket.id =', socket.id);
      roomCounts.forEach((count, tripId) => {
        if (count > 0) {
          socket.emit('join-trip', tripId);
        }
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[socketService] Connect error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[socketService] Disconnected:', reason);
    });

    socket.on('error-trip-access', ({ message }) => {
      console.warn('Socket trip access denied:', message);
    });
  }
  return socket;
};

export const joinTripRoom = (tripId) => {
  console.log('[socketService] joinTripRoom called with tripId =', tripId);
  if (!tripId) return;

  const s = getSocket();
  const count = (roomCounts.get(tripId) || 0) + 1;
  roomCounts.set(tripId, count);

  if (count === 1 && s.connected) {
    s.emit('join-trip', tripId);
  }
};

export const leaveTripRoom = (tripId) => {
  if (!tripId) return;

  const s = getSocket();
  const count = (roomCounts.get(tripId) || 1) - 1;

  if (count <= 0) {
    roomCounts.delete(tripId);
    if (s.connected) {
      s.emit('leave-trip', tripId);
    }
  } else {
    roomCounts.set(tripId, count);
  }
};