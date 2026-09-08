const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const activityService = {
  getRecent: async (limit = 3) => {
    const response = await fetch(`${API_BASE_URL}/api/activities/recent?limit=${limit}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('Could not fetch activities');
      return [];
    }
    return response.json();
  },
};