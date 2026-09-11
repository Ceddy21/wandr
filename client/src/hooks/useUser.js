import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe();
        setUser(data.user);
        setUserName(data.user?.name || 'User');
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

  return {
    user,        
    userName,   
    loading,
    error,
  };
};