import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Calendar, UserPlus, X, Loader, KeyRound } from 'lucide-react';
import CreateTripModal from '../components/ui/CreateTripModal';
import { useUser } from '../hooks/useUser';
import { useTrips } from '../hooks/useTrips';
import { useRecentActivities } from '../hooks/useRecentActivity';
import { DashboardLoading } from '../components/dashboard/DashboardLoading';
import { DashboardError } from '../components/dashboard/DashboardError';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { TripStats } from '../components/dashboard/TripStats';
import { NextTrip } from '../components/dashboard/NextTrip';
import { TripControls } from '../components/dashboard/TripControls';
import { TripList } from '../components/dashboard/TripList';
import { Pagination } from '../components/dashboard/Pagination';
import { EmptyState } from '../components/dashboard/EmptyState';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { QuickViewModal } from '../components/dashboard/QuickViewModal';

import { filterTrips, sortTrips, paginateTrips, getTripStats, getNextTrip } from '../utils/tripUtils.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const navigate = useNavigate();
  const { userName } = useUser();
  const { trips, loading, error, createTrip, deleteTrip, archiveTrip, refetch } = useTrips();
  const { activities } = useRecentActivities(3);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    members: 1,
  });

  const activeTrips = trips.filter((trip) => trip.status !== 'archived');

  const pageSize = 6;
  const filtered = filterTrips(activeTrips, searchTerm, filterStatus);
  const sorted = sortTrips(filtered, sortBy);
  const paginated = paginateTrips(sorted, currentPage, pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const stats = getTripStats(sorted);
  const nextTrip = getNextTrip(sorted);

  const handleCreateTrip = () => setIsCreateModalOpen(true);

  const handleQuickView = (trip) => {
    setSelectedTrip(trip);
    setIsQuickViewOpen(true);
  };

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

  if (loading) return <DashboardLoading />;
  if (error) return <DashboardError error={error} />;

  const btnBase =
    'inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 h-9 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 sm:flex-initial';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-12">
      <Toaster position="top-right" />

      <WelcomeBanner userName={userName} total={stats.total} upcoming={stats.upcoming} />
      <TripStats stats={stats} />
      <NextTrip trip={nextTrip} />

      <div className="flex items-center gap-1.5 sm:gap-3 mb-6">
        <button
          type="button"
          onClick={handleCreateTrip}
          className={`${btnBase} bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20`}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">New Trip</span>
          <span className="xs:hidden">New</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/calendar')}
          className={`${btnBase} border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text hover:border-terracotta dark:hover:border-dark-terracotta hover:text-terracotta dark:hover:text-dark-terracotta`}
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">View Calendar</span>
          <span className="xs:hidden">Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setIsJoinModalOpen(true)}
          className={`${btnBase} border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text hover:border-terracotta dark:hover:border-dark-terracotta hover:text-terracotta dark:hover:text-dark-terracotta`}
        >
          <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Join with Code</span>
          <span className="xs:hidden">Join</span>
        </button>
      </div>

      <TripControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {paginated.length > 0 ? (
        <>
          <TripList
            trips={paginated}
            viewMode={viewMode}
            onQuickView={handleQuickView}
            onArchive={archiveTrip}
            onDelete={deleteTrip}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sorted.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <EmptyState
          onNewTrip={handleCreateTrip}
          onJoinTrip={() => setIsJoinModalOpen(true)}
        />
      )}

      <RecentActivityList activities={activities} />

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitNewTrip}
        newTrip={newTrip}
        setNewTrip={setNewTrip}
      />

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        trip={selectedTrip}
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

export default Dashboard;