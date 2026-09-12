const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const activityService = {
  getRecent: async (limit = 3, excludeSelf = true) => {
    const params = new URLSearchParams({
      limit,
      excludeSelf: excludeSelf ? 'true' : 'false',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/activities/recent?${params}`,
      { credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch recent activities');
    }
    return response.json();
  },

  getFiltered: async ({
    tripId = 'all',
    type = 'all',
    limit = 100,
    excludeSelf = false,
  } = {}) => {
    const params = new URLSearchParams({
      tripId,
      type,
      limit,
      excludeSelf: excludeSelf ? 'true' : 'false',
    });

    const response = await fetch(
      `${API_BASE_URL}/api/activities?${params}`,
      { credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch activities');
    }
    return response.json();
  },

  getTrips: async () => {
    const response = await fetch(`${API_BASE_URL}/api/activities/trips`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch trips');
    }
    return response.json();
  },

  markRead: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/activities/${id}/read`,
      { method: 'PATCH', credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to mark as read');
    }
    return response.json();
  },

  markAllRead: async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/activities/read-all`,
      { method: 'PATCH', credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to mark all as read');
    }
    return response.json();
  },
};