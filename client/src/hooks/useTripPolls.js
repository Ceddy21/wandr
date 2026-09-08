import { useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTripPolls = (tripId, trip, setTrip) => {
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    createdBy: '',
  });

  const addPollOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updatePollOption = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const removePollOption = (index) => {
    if (newPoll.options.length <= 2) {
      toast.error('Poll needs at least 2 options');
      return;
    }
    const updatedOptions = newPoll.options.filter((_, i) => i !== index);
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const createPoll = async () => {
    if (!newPoll.question || newPoll.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields');
      return;
    }

    const validOptions = newPoll.options.filter(opt => opt.trim());

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newPoll.question,
          options: validOptions,
          createdBy: newPoll.createdBy || trip.members[0]?.name || 'Someone',
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to create poll');

      const updatedTrip = await res.json();
      setTrip(updatedTrip);

      const adminName = trip.members.find(m => m.role === 'admin')?.name || trip.members[0]?.name || '';
      setNewPoll({ question: '', options: ['', ''], createdBy: adminName });

      toast.success('Poll created!');
    } catch (err) {
      toast.error(err.message || 'Failed to create poll');
    }
  };

  return {
    newPoll,
    setNewPoll,
    addPollOption,
    updatePollOption,
    removePollOption,
    createPoll,
  };
};