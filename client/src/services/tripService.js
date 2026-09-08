const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const tripService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/trips`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch trips');
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create trip');
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete');
    }
    return response.json();
  },

  archive: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${id}/archive`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to archive');
    }
    return response.json();
  },
};