import { useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTripActivities = (tripId, trip, setTrip) => {
  const [newActivity, setNewActivity] = useState({
    day: 1,
    time: '',
    title: '',
    type: 'activity',
  });

  const addActivity = async () => {
    if (!newActivity.title || !newActivity.time) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: parseInt(newActivity.day) || 1,
          time: newActivity.time,
          title: newActivity.title,
          type: newActivity.type || 'activity',
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to add activity');

      const updatedTrip = await res.json();
      setTrip(updatedTrip);

      setNewActivity({ day: 1, time: '', title: '', type: 'activity' });
      toast.success('Activity added!');
    } catch (err) {
      toast.error(err.message || 'Failed to add activity');
    }
  };

  return { newActivity, setNewActivity, addActivity };
};