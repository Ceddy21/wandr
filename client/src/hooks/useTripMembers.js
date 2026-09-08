import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTripMembers = (tripId, trip, setTrip) => {
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!memberSearch || memberSearch.length < 2) {
      setMemberSuggestions([]);
      return;
    }

    setIsSearchingMembers(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/users/search?q=${encodeURIComponent(memberSearch)}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Failed to search');
        const data = await res.json();
        const filtered = data.filter(user =>
          !trip.members.some(m => m._id === user._id)
        );
        setMemberSuggestions(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setMemberSuggestions([]);
      } finally {
        setIsSearchingMembers(false);
      }
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [memberSearch, trip]);

  const addMember = async (user) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to add member');
      const updated = await res.json();
      setTrip(updated);
      setMemberSearch('');
      setMemberSuggestions([]);
      toast.success(`${user.name} added to the trip!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
    }
  };

  const removeMember = async (memberId) => {
    if (trip.members.find(m => m._id === memberId)?.role === 'admin') {
      toast.error('Cannot remove the admin.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to remove member');
      const updated = await res.json();
      setTrip(updated);
      toast.success('Member removed.');
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  return {
    memberSearch,
    setMemberSearch,
    memberSuggestions,
    isSearchingMembers,
    addMember,
    removeMember,
  };
};