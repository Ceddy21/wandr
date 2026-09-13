import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';
import { getSocket, joinTripRoom, leaveTripRoom } from '../services/socketService';

export const useTripItinerary = (tripId) => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    day: 1,
    time: '9:00 AM',
    title: '',
    type: 'activity',
  });

  // ─── Fetch initial itinerary ─────────────────────────────
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!tripId) return;
      setLoading(true);
      try {
        const data = await tripService.getItinerary(tripId);
        setItinerary(data);
      } catch (err) {
        console.error('Fetch itinerary error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [tripId]);

  // ─── Subscribe to socket events ──────────────────────────
  useEffect(() => {
    if (!tripId) return;

    const socket = getSocket();
    joinTripRoom(tripId);

    const handleAdded = ({ item }) => {
      setItinerary((prev) => {
        if (prev.some((i) => i._id === item._id)) return prev;
        return [...prev, item];
      });
    };

    const handleUpdated = ({ item }) => {
      setItinerary((prev) =>
        prev.map((i) => (i._id === item._id ? item : i))
      );
    };

    const handleDeleted = ({ itemId }) => {
      setItinerary((prev) => prev.filter((i) => i._id !== itemId));
    };

    socket.on('itinerary-added', handleAdded);
    socket.on('itinerary-updated', handleUpdated);
    socket.on('itinerary-deleted', handleDeleted);

    return () => {
      socket.off('itinerary-added', handleAdded);
      socket.off('itinerary-updated', handleUpdated);
      socket.off('itinerary-deleted', handleDeleted);
      leaveTripRoom(tripId);
    };
  }, [tripId]);

  // ─── Actions ─────────────────────────────────────────────
  const addActivity = async () => {
    if (!newActivity.title || !newActivity.time) {
      toast.error('Please fill in all fields');
      return { success: false };
    }

    try {
      const created = await tripService.addItinerary(tripId, {
        day: parseInt(newActivity.day) || 1,
        time: newActivity.time,
        title: newActivity.title,
        type: newActivity.type || 'activity',
      });

      setItinerary((prev) => {
        if (prev.some((i) => i._id === created._id)) return prev;
        return [...prev, created];
      });
      setNewActivity({ day: 1, time: '9:00 AM', title: '', type: 'activity' });
      toast.success('Activity added!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to add activity');
      return { success: false };
    }
  };

  const updateActivity = async (activityId, activityData) => {
    try {
      const updated = await tripService.updateItinerary(
        tripId,
        activityId,
        activityData
      );
      setItinerary((prev) =>
        prev.map((item) => (item._id === activityId ? updated : item))
      );
      toast.success('Activity updated!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update activity');
      return { success: false };
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await tripService.deleteItinerary(tripId, activityId);
      setItinerary((prev) => prev.filter((item) => item._id !== activityId));
      toast.success('Activity deleted!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete activity');
      return { success: false };
    }
  };

  return {
    itinerary,
    loading,
    newActivity,
    setNewActivity,
    addActivity,
    updateActivity,
    deleteActivity,
  };
};