import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';
import { getSocket, joinTripRoom, leaveTripRoom } from '../services/socketService';

export const useTripMessages = (tripId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  // ─── Fetch initial messages ──────────────────────────────
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

  // ─── Subscribe to socket events ──────────────────────────
  useEffect(() => {
    if (!tripId) return;

    const socket = getSocket();
    joinTripRoom(tripId);

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleMessageUpdated = (message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      );
    };

    const handleMessagesRead = ({ userId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.userId !== userId && m.status !== 'read'
            ? { ...m, status: 'read' }
            : m
        )
      );
    };

    socket.on('new-message', handleNewMessage);
    socket.on('message-updated', handleMessageUpdated);
    socket.on('messages-read', handleMessagesRead);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-updated', handleMessageUpdated);
      socket.off('messages-read', handleMessagesRead);
      leaveTripRoom(tripId);
    };
  }, [tripId]);

  // ─── Actions ─────────────────────────────────────────────
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