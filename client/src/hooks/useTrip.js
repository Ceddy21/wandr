import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTrip = (tripId) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTrip = async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Trip not found');
          navigate('/dashboard');
          return;
        }
        throw new Error('Failed to fetch trip');
      }

      const data = await res.json();
      setTrip(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load trip');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete trip');

      toast.success('Trip deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to delete trip');
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  return {
    trip,
    setTrip,
    loading,
    deleteTrip,
    refetch: fetchTrip,
  };
};