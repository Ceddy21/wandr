const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
};