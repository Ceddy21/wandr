import { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';

export const useRecentActivities = (limit = 3) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchActivities = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await activityService.getRecent(limit, false);
        if (!cancelled) setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        if (!cancelled) {
          setError(err.message);
          setActivities([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchActivities();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { activities, loading, error };
};