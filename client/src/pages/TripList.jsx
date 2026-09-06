import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, Calendar, Users, MapPin, ArrowRight, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateTripModal from '../components/ui/CreateTripModal';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    members: 1
  });

  const handleCreateTrip = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitNewTrip = () => {
    if (!newTrip.name || !newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const newTripData = {
      id: trips.length + 1,
      name: newTrip.name,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      members: parseInt(newTrip.members, 10),
      status: 'upcoming'
    };

    setTrips([newTripData, ...trips]);
    setIsCreateModalOpen(false);
    setNewTrip({
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      members: 1
    });
    toast.success('New trip created!');
  };

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError('');
      try {
        // --- REPLACE WITH REAL API CALL ---
        // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // const response = await fetch(`${API_URL}/api/trips`);
        // if (!response.ok) throw new Error('Failed to fetch trips');
        // const data = await response.json();
        // setTrips(data);

        // --- MOCK DATA (temporary) ---
        const mockTrips = [
          { id: 1, name: "Bora 2025 with Friends", destination: "Boracay, Philippines", startDate: "2025-05-10", endDate: "2025-05-15", members: 4, status: "upcoming" },
          { id: 2, name: "Siargao Surf Trip", destination: "Siargao, Philippines", startDate: "2025-06-05", endDate: "2025-06-12", members: 3, status: "ongoing" },
          { id: 3, name: "El Nido Escape", destination: "El Nido, Palawan", startDate: "2025-07-20", endDate: "2025-07-27", members: 5, status: "upcoming" },
          { id: 4, name: "Baguio Retreat", destination: "Baguio, Philippines", startDate: "2025-04-01", endDate: "2025-04-05", members: 2, status: "completed" }
        ];
        setTrips(mockTrips);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (trip.name && trip.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getSortedTrips = (tripsArray) => {
    const copy = [...tripsArray];
    if (sortBy === 'date') {
      return copy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }
    if (sortBy === 'destination') {
      return copy.sort((a, b) => a.destination.localeCompare(b.destination));
    }
    if (sortBy === 'members') {
      return copy.sort((a, b) => b.members - a.members);
    }
    return copy;
  };

  const sortedTrips = getSortedTrips(filteredTrips);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
        <div className="flex items-center gap-3">
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
          {sortedTrips.map(trip => (
            <Link
              key={trip.id}
              to={`/trip/${trip.id}`}
              className="block bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-5 hover:border-terracotta dark:hover:border-dark-terracotta hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-serif font-semibold text-deep-charcoal dark:text-dark-text">
                      {trip.name || trip.destination}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
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
                      {trip.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {trip.destination.split(',')[0]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-terracotta dark:text-dark-terracotta flex items-center gap-1">
                    View Details <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">No trips found</h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitNewTrip}
        newTrip={newTrip}
        setNewTrip={setNewTrip}
      />
    </div>
  );
}

export default TripList;