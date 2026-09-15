import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader, Save, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditTripModal = ({ isOpen, onClose, trip, onSave }) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetMembers, setTargetMembers] = useState(1);
  const [saving, setSaving] = useState(false);

  const [destinationSearch, setDestinationSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && trip) {
      setName(trip.name || '');
      setDestination(trip.destination || '');
      setDestinationSearch(trip.destination || '');
      setStartDate(trip.startDate ? trip.startDate.slice(0, 10) : '');
      setEndDate(trip.endDate ? trip.endDate.slice(0, 10) : '');
      setTargetMembers(trip.targetMembers || 1);
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [isOpen, trip]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDestinations = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const username = import.meta.env.VITE_GEONAMES_USERNAME;

      if (!username) {
        toast.error('GeoNames username is missing. Please add VITE_GEONAMES_USERNAME to your .env file.');
        setIsLoadingSuggestions(false);
        return;
      }

      const url = `https://secure.geonames.org/searchJSON?country=PH&featureClass=P&name_startsWith=${encodeURIComponent(query)}&maxRows=10&username=${username}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status) {
        throw new Error(data.status.message || 'GeoNames API error');
      }

      const destinations = data.geonames?.map((item) => {
        const province = item.adminName1 || '';
        return province ? `${item.name}, ${province}` : item.name;
      }) || [];

      setSuggestions(destinations);
      setIsDropdownOpen(destinations.length > 0);
    } catch (error) {
      console.error('GeoNames search error:', error.message);
      toast.error('Could not load destination suggestions');
      setSuggestions([]);
      setIsDropdownOpen(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchDestinations(destinationSearch);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [destinationSearch, fetchDestinations, isOpen]);

  const handleSelectDestination = (dest) => {
    setDestinationSearch(dest);
    setDestination(dest);
    setIsDropdownOpen(false);
    setSuggestions([]);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationSearch(value);
    setDestination(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!name.trim() || !destination.trim() || !startDate || !endDate) {
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        targetMembers: parseInt(targetMembers, 10) || 1,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed] dark:border-dark-border">
          <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
            Edit trip
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Trip name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a destination in the Philippines..."
                value={destinationSearch}
                onChange={handleDestinationChange}
                onFocus={() => {
                  if (suggestions.length > 0) setIsDropdownOpen(true);
                }}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
              />
              {isLoadingSuggestions ? (
                <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta dark:text-dark-terracotta animate-spin" />
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
              )}
            </div>

            {isDropdownOpen && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((dest, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft cursor-pointer transition-colors text-sm text-deep-charcoal dark:text-dark-text"
                    onClick={() => handleSelectDestination(dest)}
                  >
                    {dest}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Target members
            </label>
            <input
              type="number"
              min="1"
              value={targetMembers}
              onChange={(e) => setTargetMembers(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white font-medium hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-60 transition-colors"
            >
              {saving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;