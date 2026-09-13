import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    // On reconnect, re-join all active trip rooms
    socket.on('connect', () => {
      roomCounts.forEach((count, tripId) => {
        if (count > 0) {
          socket.emit('join-trip', tripId);
        }
      });
    });
  }
  return socket;
};

const roomCounts = new Map();

export const joinTripRoom = (tripId) => {
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