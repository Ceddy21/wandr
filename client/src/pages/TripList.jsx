import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Plus,
  UserPlus,
  X,
  Loader,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateTripModal from '../components/ui/CreateTripModal';
import { useTrips } from '../hooks/useTrips';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function TripList() {
  const navigate = useNavigate();
  const { trips, loading, error, createTrip, refetch } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    members: 1,
  });

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const handleCreateTrip = () => setIsCreateModalOpen(true);

  const handleSubmitNewTrip = async () => {
    if (!newTrip.name || !newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const result = await createTrip({
      name: newTrip.name,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      members: [],
      targetMembers: parseInt(newTrip.members, 10) || 1,
    });

    if (result.success) {
      setIsCreateModalOpen(false);
      setNewTrip({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        members: 1,
      });
    }
  };

  const handleJoinTrip = async () => {
    const code = joinCode.trim().toUpperCase();

    if (!code) {
      toast.error('Please enter a share code');
      return;
    }
    if (code.length !== 6) {
      toast.error('Share code must be 6 characters');
      return;
    }

    setJoining(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/join/${code}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid code');
      }

      toast.success(data.message || 'Joined trip!');
      setIsJoinModalOpen(false);
      setJoinCode('');

      if (refetch) await refetch();

      if (data.tripId) {
        navigate(`/trip/${data.tripId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to join trip');
    } finally {
      setJoining(false);
    }
  };

  const handleJoinKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleJoinTrip();
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (trip.destination || '').toLowerCase().includes(term) ||
      (trip.name || '').toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getSortedTrips = (arr) => {
    const copy = [...arr];
    if (sortBy === 'date') {
      return copy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }
    if (sortBy === 'destination') {
      return copy.sort((a, b) =>
        (a.destination || '').localeCompare(b.destination || '')
      );
    }
    if (sortBy === 'members') {
      return copy.sort((a, b) => {
        const aCount = Array.isArray(a.members) ? a.members.length : 0;
        const bCount = Array.isArray(b.members) ? b.members.length : 0;
        return bCount - aCount;
      });
    }
    return copy;
  };

  const sortedTrips = getSortedTrips(filteredTrips);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ongoing':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
      case 'archived':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'archived':
        return 'Archived';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMemberCount = (trip) => {
    if (Array.isArray(trip.members)) return trip.members.length;
    if (typeof trip.members === 'number') return trip.members;
    return trip.targetMembers || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-terracotta dark:text-dark-terracotta">Loading trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
            All Trips
          </h1>
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
            {sortedTrips.length} trip{sortedTrips.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text text-sm font-medium rounded-lg hover:border-terracotta dark:hover:border-dark-terracotta hover:text-terracotta dark:hover:text-dark-terracotta transition-all duration-200"
          >
            <UserPlus className="w-4 h-4" />
            Join with Code
          </button>
          <button
            onClick={handleCreateTrip}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-105 shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
          <Link
            to="/dashboard"
            className="text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search trips by name or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
          >
            <option value="all">All Trips</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="relative">
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
          >
            <option value="date">Sort by Date</option>
            <option value="destination">Sort by Destination</option>
            <option value="members">Sort by Members</option>
          </select>
        </div>
      </div>

      {sortedTrips.length > 0 ? (
        <div className="space-y-3">
          {sortedTrips.map((trip) => {
            const memberCount = getMemberCount(trip);

            return (
              <Link
                key={trip._id}
                to={`/trip/${trip._id}`}
                className="block bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-5 hover:border-terracotta dark:hover:border-dark-terracotta hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-serif font-semibold text-deep-charcoal dark:text-dark-text">
                        {trip.name || trip.destination}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {getStatusLabel(trip.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {memberCount} {memberCount === 1 ? 'member' : 'members'}
                      </span>
                      {trip.destination && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.destination.split(',')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-terracotta dark:text-dark-terracotta flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <MapPin className="w-16 h-16 text-terracotta dark:text-dark-terracotta opacity-60" />
          </div>
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
            No trips found
          </h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first trip or join one with a code!'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleCreateTrip}
                className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
              >
                + Create your first trip
              </button>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="px-6 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:border-terracotta dark:hover:border-dark-terracotta transition-colors"
              >
                Join with code
              </button>
            </div>
          )}
        </div>
      )}

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitNewTrip}
        newTrip={newTrip}
        setNewTrip={setNewTrip}
      />

      {isJoinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => !joining && setIsJoinModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed] dark:border-dark-border">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
                <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
                  Join a trip
                </h2>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                disabled={joining}
                className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
                Ask the trip owner for a 6-character share code, then enter it below.
              </p>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Share code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) =>
                      setJoinCode(
                        e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, '')
                          .slice(0, 6)
                      )
                    }
                    onKeyDown={handleJoinKeyDown}
                    placeholder="ABC123"
                    maxLength={6}
                    autoFocus
                    disabled={joining}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text text-center font-mono text-lg tracking-[0.4em] uppercase focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1.5">
                  {joinCode.length}/6 characters
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  disabled={joining}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinTrip}
                  disabled={joining || joinCode.length !== 6}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white font-medium hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {joining ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Join trip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripList;