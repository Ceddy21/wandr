import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';
import { getSocket, connectSocket } from '../services/socketService';

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
      const updatedTrip = await tripService.archive(tripId);
      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? updatedTrip : trip
        )
      );
      toast.success('Trip archived!');
    } catch (err) {
      toast.error(err.message || 'Failed to archive trip');
    }
  };

  const unarchiveTrip = async (tripId) => {
    try {
      const updatedTrip = await tripService.unarchive(tripId);
      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? updatedTrip : trip
        )
      );
      toast.success('Trip restored!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to unarchive trip');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    let mounted = true;
    let socketInstance = null;

    const setup = async () => {
      socketInstance = await connectSocket();
      if (!mounted || !socketInstance) return;

      const handleTripsChanged = () => {
        fetchTrips();
      };

      const handleRemovedFromTrip = () => {
        fetchTrips();
      };

      socketInstance.on('trips-changed', handleTripsChanged);
      socketInstance.on('removed-from-trip', handleRemovedFromTrip);
    };

    setup();

    return () => {
      mounted = false;
      if (socketInstance) {
        socketInstance.off('trips-changed');
        socketInstance.off('removed-from-trip');
      }
    };
  }, []);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    deleteTrip,
    archiveTrip,
    unarchiveTrip,
  };
};