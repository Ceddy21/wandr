import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function CreateTripModal({ isOpen, onClose, onSubmit, newTrip, setNewTrip }) {
  const [dateError, setDateError] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

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

      const url = `http://api.geonames.org/searchJSON?country=PH&featureClass=P&name_startsWith=${encodeURIComponent(query)}&maxRows=10&username=${username}`;

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
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (isOpen && newTrip.destination && !destinationSearch) {
      setDestinationSearch(newTrip.destination);
    }

    searchTimeout.current = setTimeout(() => {
      fetchDestinations(destinationSearch);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [destinationSearch, fetchDestinations, isOpen, newTrip.destination]);

  const handleSelectDestination = (dest) => {
    setDestinationSearch(dest);
    setNewTrip({ ...newTrip, destination: dest });
    setIsDropdownOpen(false);
    setSuggestions([]);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationSearch(value);
    setNewTrip({ ...newTrip, destination: value });
  };

  useEffect(() => {
    if (!isOpen) {
      setDestinationSearch('');
      setSuggestions([]);
      setIsDropdownOpen(false);
      setDateError('');
    }
  }, [isOpen]);

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(newTrip.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(newTrip.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setDateError('Start date cannot be in the past.');
      return false;
    }

    if (endDate < today) {
      setDateError('End date cannot be in the past.');
      return false;
    }

    if (endDate < startDate) {
      setDateError('End date must be after start date.');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleSubmit = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      setDateError('Please fill in all required fields.');
      return;
    }

    if (!validateDates()) {
      return;
    }

    onSubmit();
  };

  const handleDateChange = (field, value) => {
    setNewTrip({ ...newTrip, [field]: value });
    setDateError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">
          Create New Trip
        </h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
          Plan your next adventure with friends.
        </p>

        {dateError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{dateError}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5"
            >
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                id="destination"
                placeholder="Search for a destination in the Philippines..."
                value={destinationSearch}
                onChange={handleDestinationChange}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
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

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={newTrip.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={newTrip.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="members"
              className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5"
            >
              Number of Members
            </label>
            <input
              type="number"
              id="members"
              min="1"
              value={newTrip.members}
              onChange={(e) => {
                setNewTrip({ ...newTrip, members: parseInt(e.target.value, 10) || 1 });
                setDateError('');
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
            >
              Create Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTripModal;