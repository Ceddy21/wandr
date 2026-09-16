const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const tripService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/trips`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch trips');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch trip');
    }
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
      throw new Error(err.message || 'Failed to delete trip');
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

  unarchive: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${id}/unarchive`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to unarchive');
    }
    return response.json();
  },

  getItinerary: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/itinerary`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch itinerary');
    }
    return response.json();
  },

  addItinerary: async (tripId, data) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to add itinerary item');
    }
    return response.json();
  },

  updateItinerary: async (tripId, itineraryId, data) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/itinerary/${itineraryId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update itinerary item');
    }
    return response.json();
  },

  deleteItinerary: async (tripId, itineraryId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/itinerary/${itineraryId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete itinerary item');
    }
    return response.json();
  },

  getExpenses: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/expenses`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch expenses');
    }
    return response.json();
  },

  addExpense: async (tripId, expenseData) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to add expense');
    }
    return response.json();
  },

  updateExpense: async (tripId, expenseId, expenseData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/expenses/${expenseId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update expense');
    }
    return response.json();
  },

  deleteExpense: async (tripId, expenseId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/expenses/${expenseId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete expense');
    }
    return response.json();
  },

  getMessages: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/messages`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch messages');
    }
    return response.json();
  },

  addMessage: async (tripId, data) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to send message');
    }
    return response.json();
  },

  editMessage: async (tripId, messageId, text) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/messages/${messageId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to edit message');
    }
    return response.json();
  },

  deleteMessage: async (tripId, messageId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/messages/${messageId}`,
      { method: 'DELETE', credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete message');
    }
    return response.json();
  },

  markMessagesRead: async (tripId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/messages/mark-read`,
      { method: 'PUT', credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to mark messages as read');
    }
    return response.json();
  },

  getPolls: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/polls`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch polls');
    }
    return response.json();
  },

  addPoll: async (tripId, pollData) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pollData),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create poll');
    }
    return response.json();
  },

  deletePoll: async (tripId, pollId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/polls/${pollId}`,
      { method: 'DELETE', credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete poll');
    }
    return response.json();
  },

  addPollChoice: async (tripId, pollId, text) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/polls/${pollId}/choices`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to add choice');
    }
    return response.json();
  },

  deletePollChoice: async (tripId, pollId, choiceId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/polls/${pollId}/choices/${choiceId}`,
      { method: 'DELETE', credentials: 'include' }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete choice');
    }
    return response.json();
  },

  votePoll: async (tripId, pollId, optionText) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/polls/${pollId}/vote`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionText }),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to vote');
    }
    return response.json();
  },

  addMember: async (tripId, userId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to add member');
    }
    return response.json();
  },

  removeMember: async (tripId, userId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/members/${userId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to remove member');
    }
    return response.json();
  },

  leaveTrip: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/leave`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to leave trip');
    }
    return response.json();
  },

  transferOwnership: async (tripId, newOwnerId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/transfer-ownership`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOwnerId }),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to transfer ownership');
    }
    return response.json();
  },
};