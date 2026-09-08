import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useUser = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe();
        setUserName(data.user.name || 'User');
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError(err.message);
        setUserName('User');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { userName, loading, error };
};