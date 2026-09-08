import { useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTripMessages = (tripId, trip, setTrip) => {
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage.trim() }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to send message');

      const updatedTrip = await res.json();
      setTrip(updatedTrip);
      setNewMessage('');
      toast.success('Message sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    }
  };

  return { newMessage, setNewMessage, sendMessage };
};