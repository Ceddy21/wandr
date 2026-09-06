import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Plus, Search, Filter, Users, Calendar, Clock, CheckCircle, Plane, User, Activity, Loader, ArrowUpRight, MapPin, Calendar as CalendarIcon, Users as UsersIcon, ArrowRight, ChevronDown, Sparkles, Eye, Grid3x3, List, X, Archive, Trash2, DollarSign, UserPlus, FileText } from 'lucide-react';
import CreateTripModal from '../components/ui/CreateTripModal';

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [userName, setUserName] = useState('Bhrenda Mae');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    members: 1
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const pageSize = 6;

  const handleCreateTrip = () => {
    setIsCreateModalOpen(true);
  };

  const handleArchiveTrip = () => toast.success('Trip archived successfully!');
  const handleDeleteTrip = () => toast.error('Trip deleted');

  const handleQuickView = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleSubmitNewTrip = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const newTripData = {
      id: trips.length + 1,
      name: newTrip.destination,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      members: parseInt(newTrip.members, 10),
      status: 'upcoming',
      progress: 0,
      activities: 0,
      completedActivities: 0,
      budget: 0,
      spent: 0
    };

    setTrips([newTripData, ...trips]);
    setIsCreateModalOpen(false);
    setNewTrip({
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

      // TODO: Uncomment when backend is ready
      // try {
      //   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      //   const response = await fetch(`${API_BASE_URL}/api/trips`);
      //   if (!response.ok) throw new Error('Failed to fetch trips');
      //   const data = await response.json();
      //   setTrips(data);
      // } catch (err) {
      //   setError(err.message);
      //   toast.error('Could not load trips. Please try again.');
      // } finally {
      //   setLoading(false);
      // }

      const dummyTrip = {
        id: 1,
        name: "Bora 2025 with Friends",
        destination: "Boracay, Philippines",
        startDate: "2025-05-10",
        endDate: "2025-05-15",
        members: 4,
        status: "upcoming",
        progress: 0,
        activities: 12,
        completedActivities: 5,
        budget: 5000,
        spent: 2100
      };
      setTrips([dummyTrip]);
      setLoading(false);
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        // --- REPLACE WITH REAL API CALL ---
        // const response = await fetch('/api/activities/recent?limit=3');
        // const data = await response.json();
        // setRecentActivities(data);

        // --- MOCK DATA (temporary) ---
        const mockActivities = [
          {
            id: 1,
            type: 'expense_added',
            user: { name: 'Maya' },
            trip: { name: 'Bora 2025 with Friends' },
            description: 'added ₱500 for food',
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: 2,
            type: 'member_added',
            user: { name: 'Alex' },
            trip: { name: 'Bora 2025 with Friends' },
            description: 'added Sophie to the trip',
            createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          },
          {
            id: 3,
            type: 'activity_added',
            user: { name: 'Sophie' },
            trip: { name: 'Siargao Surf Trip' },
            description: 'added "Surfing Lesson" to itinerary',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          },
        ];
        setRecentActivities(mockActivities);
      } catch (err) {
        console.error('Failed to fetch recent activities:', err);
      }
    };
    fetchRecentActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'expense_added': return <DollarSign className="w-4 h-4" />;
      case 'member_added': return <UserPlus className="w-4 h-4" />;
      case 'activity_added': return <MapPin className="w-4 h-4" />;
      case 'trip_created': return <Activity className="w-4 h-4" />;
      case 'poll_created': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'expense_added': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'member_added': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'activity_added': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'trip_created': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'poll_created': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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
  const totalPages = Math.ceil(sortedTrips.length / pageSize);
  const paginatedTrips = sortedTrips.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const total = sortedTrips.length;
  const upcoming = sortedTrips.filter((t) => t.status === 'upcoming').length;
  const ongoing = sortedTrips.filter((t) => t.status === 'ongoing').length;
  const completed = sortedTrips.filter((t) => t.status === 'completed').length;

  const nextTrip = sortedTrips
    .filter((t) => t.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const daysRemaining = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

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

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="w-2/3">
              <Skeleton height={24} />
              <Skeleton height={16} className="mt-2" />
            </div>
            <Skeleton width={60} height={20} borderRadius={999} />
          </div>
          <Skeleton height={4} className="mt-3" />
          <div className="mt-3 flex items-center gap-3">
            <Skeleton width={80} height={16} />
            <Skeleton width={80} height={16} />
          </div>
          <div className="mt-3 flex items-center gap-1">
            <Skeleton circle width={24} height={24} />
            <Skeleton circle width={24} height={24} />
            <Skeleton circle width={24} height={24} />
            <Skeleton circle width={24} height={24} />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
        <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-terracotta/10 via-terracotta-soft/20 to-[#2D6A4F]/10 dark:from-dark-terracotta/10 dark:via-dark-terracotta-soft/20 dark:to-[#E76F51]/10 rounded-2xl border border-terracotta/20 dark:border-dark-terracotta/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-terracotta/20 dark:bg-dark-terracotta/20">
                <Sparkles className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
              </div>
              <div>
                <Skeleton width={200} height={28} />
                <Skeleton width={300} height={20} className="mt-1" />
              </div>
            </div>
            <Skeleton width={200} height={20} />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-3 sm:p-4 text-center">
              <Skeleton width={40} height={32} className="mx-auto" />
              <Skeleton width={80} height={16} className="mx-auto mt-1" />
            </div>
          ))}
        </div>
        <LoadingSkeleton />
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
      <Toaster position="top-right" />

      <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-terracotta/10 via-terracotta-soft/20 to-[#2D6A4F]/10 dark:from-dark-terracotta/10 dark:via-dark-terracotta-soft/20 dark:to-[#E76F51]/10 rounded-2xl border border-terracotta/20 dark:border-dark-terracotta/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-terracotta/20 dark:bg-dark-terracotta/20">
              <Sparkles className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-deep-charcoal dark:text-dark-text">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userName}!
              </h2>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
                {total > 0 
                  ? `You have ${total} trip${total > 1 ? 's' : ''} planned. ${upcoming > 0 ? `${upcoming} upcoming adventure${upcoming > 1 ? 's' : ''} await${upcoming > 1 ? '' : 's'} you!` : 'Time to plan your next adventure!'}`
                  : 'Ready to plan your next adventure with friends?'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-warm-grey dark:text-dark-text-secondary">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-3 sm:p-4 text-center group hover:border-terracotta dark:hover:border-dark-terracotta transition-all duration-300">
          <p className="text-2xl sm:text-3xl font-bold text-deep-charcoal dark:text-dark-text">{total}</p>
          <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            Total Trips
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-3 sm:p-4 text-center group hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300">
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{upcoming}</p>
          <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            Upcoming
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-3 sm:p-4 text-center group hover:border-green-500 dark:hover:border-green-400 transition-all duration-300">
          <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{ongoing}</p>
          <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Ongoing
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-3 sm:p-4 text-center group hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300">
          <p className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400">{completed}</p>
          <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </p>
        </div>
      </div>

      {nextTrip && (
        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-terracotta/5 to-[#2D6A4F]/5 dark:from-dark-terracotta/5 dark:to-[#E76F51]/5 rounded-xl border border-[#e8eaed] dark:border-dark-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-terracotta/10 dark:bg-dark-terracotta/10">
                <MapPin className="w-6 h-6 text-terracotta dark:text-dark-terracotta" />
              </div>
              <div>
                <p className="text-xs font-medium text-terracotta dark:text-dark-terracotta uppercase tracking-wider">Next Up</p>
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-deep-charcoal dark:text-dark-text">
                  {nextTrip.name || nextTrip.destination}
                </h3>
                <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDateRange(nextTrip.startDate, nextTrip.endDate)}
                </p>
                <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3" />
                  {daysRemaining(nextTrip.startDate)} days to go!
                </p>
              </div>
            </div>
            <a
              href={`/trip/${nextTrip.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={handleCreateTrip}
          className="flex items-center gap-2 px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-105 shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </button>
        <a
          href="/calendar"
          className="flex items-center gap-2 px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text text-sm font-medium rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-all duration-300"
        >
          <CalendarIcon className="w-4 h-4" />
          View Calendar
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search trips by destination..."
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

        <div className="flex items-center gap-1 bg-black border border-[#e8eaed] dark:border-dark-border rounded-lg overflow-hidden p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-terracotta text-white dark:bg-dark-terracotta shadow-sm' 
                : 'text-warm-grey dark:text-dark-text-secondary hover:bg-white/10'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-terracotta text-white dark:bg-dark-terracotta shadow-sm' 
                : 'text-warm-grey dark:text-dark-text-secondary hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {paginatedTrips.length > 0 ? (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
            : 'flex flex-col gap-3'
          }>
            {paginatedTrips.map((trip) => (
              <div
                key={trip.id}
                className={`bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 hover:border-terracotta dark:hover:border-dark-terracotta hover:shadow-md transition-all duration-300 group flex flex-col ${
                  viewMode === 'list' ? 'flex-row items-center' : ''
                }`}
              >
                <div className={`flex flex-col w-full ${viewMode === 'list' ? 'flex-1 flex-row items-center flex-wrap gap-4' : 'h-full'}`}>
                  <div className={`flex items-start ${viewMode === 'list' ? 'flex-1 min-w-[200px]' : ''} justify-between w-full`}>
                    <div>
                      <a href={`/trip/${trip.id}`}>
                        <h3 className="font-serif text-lg font-semibold text-deep-charcoal dark:text-dark-text group-hover:text-terracotta dark:group-hover:text-dark-terracotta transition-colors">
                          {trip.name || trip.destination}
                        </h3>
                      </a>
                      <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                      {getStatusLabel(trip.status)}
                    </span>
                  </div>

                  {viewMode === 'grid' && trip.status === 'ongoing' && (
                    <div className="mt-3 w-full">
                      <div className="flex items-center justify-between text-xs text-warm-grey dark:text-dark-text-secondary mb-1">
                        <span>Progress</span>
                        <span>{trip.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e8eaed] dark:bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-terracotta dark:bg-dark-terracotta rounded-full transition-all duration-500"
                          style={{ width: `${trip.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center justify-between w-full ${viewMode === 'list' ? 'mt-0' : 'mt-auto'}`}>
                    <div className="flex items-center gap-3 text-xs text-warm-grey dark:text-dark-text-secondary">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {trip.members} {trip.members === 1 ? 'member' : 'members'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {trip.activities} activities
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuickView(trip)}
                        className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchiveTrip(trip.id)}
                        className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-[#e8eaed] dark:border-dark-border">
              <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedTrips.length)} of {sortedTrips.length} trips
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-deep-charcoal dark:text-dark-text px-3">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <Plane className="w-16 h-16 text-terracotta dark:text-dark-terracotta opacity-60" />
          </div>
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
            No trips yet
          </h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2 max-w-md mx-auto">
            Start planning your next adventure with friends. Create your first trip and make memories together.
          </p>
          <button
            onClick={handleCreateTrip}
            className="mt-4 px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
          >
            + Create your first trip
          </button>
        </div>
      )}

      <div className="mt-8 border-t border-[#e8eaed] dark:border-dark-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text flex items-center gap-2">
            <Activity className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
            Recent Activity
          </h2>
          <a
            href="/activity"
            className="text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1"
          >
            View All →
          </a>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.slice(0, 3).map(activity => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-lg hover:border-terracotta/30 dark:hover:border-dark-terracotta/30 transition-colors"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-deep-charcoal dark:text-dark-text truncate">
                    <strong className="font-medium">{activity.user.name}</strong>
                    {' '}
                    {activity.description}
                    {' '}
                    <span className="text-terracotta dark:text-dark-terracotta font-medium">
                      {activity.trip.name}
                    </span>
                  </p>
                  <p className="text-xs text-warm-grey dark:text-dark-text-secondary">
                    {formatTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
            <p>No recent activity yet.</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-lg w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>
            <div className="flex flex-col items-start gap-2 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedTrip.status)}`}>
                  {getStatusLabel(selectedTrip.status)}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
                {selectedTrip.name || selectedTrip.destination}
              </h3>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {formatDateRange(selectedTrip.startDate, selectedTrip.endDate)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Members</p>
                <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">{selectedTrip.members}</p>
              </div>
              <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Activities</p>
                <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">{selectedTrip.activities}</p>
              </div>
              <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Budget</p>
                <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">₱{selectedTrip.budget.toLocaleString()}</p>
              </div>
              <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Spent</p>
                <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">₱{selectedTrip.spent.toLocaleString()}</p>
              </div>
            </div>
            <a
              href={`/trip/${selectedTrip.id}`}
              className="w-full py-2.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors text-center block"
            >
              View Full Details
            </a>
          </div>
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

export default Dashboard;