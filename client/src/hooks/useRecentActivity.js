import { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';

export const useRecentActivities = (limit = 3) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getRecent(limit);
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [limit]);

  return { activities, loading, error };
};