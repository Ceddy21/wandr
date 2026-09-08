import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      setError(err.message);
      toast.error('Could not load trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    try {
      const newTrip = await tripService.create(tripData);
      setTrips((prev) => [newTrip, ...prev]);
      toast.success('New trip created! 🎉');
      return { success: true, trip: newTrip };
    } catch (err) {
      toast.error(err.message || 'Failed to create trip.');
      return { success: false, error: err.message };
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await tripService.delete(tripId);
      setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
      toast.success('Trip deleted!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete trip');
    }
  };

  const archiveTrip = async (tripId) => {
    try {
      await tripService.archive(tripId);
      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? { ...trip, status: 'archived' } : trip
        )
      );
      toast.success('Trip archived!');
    } catch (err) {
      toast.error(err.message || 'Failed to archive trip');
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    deleteTrip,
    archiveTrip,
  };
};