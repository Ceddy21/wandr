import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTripMessages = (tripId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!tripId) return;
      setLoading(true);
      try {
        const data = await tripService.getMessages(tripId);
        setMessages(data);
      } catch (err) {
        console.error('Fetch messages error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [tripId]);

  useEffect(() => {
    if (!tripId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-trip', tripId);
    });

    socket.on('new-message', (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socket.on('message-updated', (message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      );
    });

    socket.on('messages-read', ({ userId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.userId !== userId && m.status !== 'read'
            ? { ...m, status: 'read' }
            : m
        )
      );
    });

    return () => {
      socket.emit('leave-trip', tripId);
      socket.disconnect();
    };
  }, [tripId]);

  const sendMessage = async (imageUrl = '') => {
    const text = newMessage.trim();
    if (!text && !imageUrl) return { success: false };

    try {
      const created = await tripService.addMessage(tripId, {
        text,
        imageUrl,
      });

      setMessages((prev) => {
        if (prev.some((m) => m._id === created._id)) return prev;
        return [...prev, created];
      });
      setNewMessage('');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
      return { success: false };
    }
  };

  const editMessage = async (messageId, text) => {
    try {
      const updated = await tripService.editMessage(tripId, messageId, text);
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? updated : m))
      );
      toast.success('Message edited!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to edit message');
      return { success: false };
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const updated = await tripService.deleteMessage(tripId, messageId);
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? updated : m))
      );
      toast.success('Message deleted!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete message');
      return { success: false };
    }
  };

  const markAsRead = async () => {
    try {
      await tripService.markMessagesRead(tripId);
      setMessages((prev) =>
        prev.map((m) =>
          m.status !== 'read' ? { ...m, status: 'read' } : m
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Mark read error:', err);
      return { success: false };
    }
  };

  return {
    messages,
    loading,
    newMessage,
    setNewMessage,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
  };
};