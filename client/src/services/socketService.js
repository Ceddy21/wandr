import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;
const roomCounts = new Map();

const fetchSocketToken = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/socket-token`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
};

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    socket.on('connect', () => {
      roomCounts.forEach((count, tripId) => {
        if (count > 0) {
          socket.emit('join-trip', tripId);
        }
      });
    });

    socket.on('error-trip-access', ({ message }) => {
      console.warn('Socket trip access denied:', message);
    });
  }
  return socket;
};

export const connectSocket = async () => {
  const s = getSocket();

  if (s.connected || s.active) return s;

  const token = await fetchSocketToken();
  if (token) {
    s.auth = { token };
  }

  s.connect();
  return s;
};

export const joinTripRoom = async (tripId) => {
  if (!tripId) return;

  const s = getSocket();
  const count = (roomCounts.get(tripId) || 0) + 1;
  roomCounts.set(tripId, count);

  if (!s.connected) {
    await connectSocket();
    return;
  }

  if (count === 1) {
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