import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CreateTripModal from '../components/ui/CreateTripModal';
import { useUser } from '../hooks/useUser';
import { useTrips } from '../hooks/useTrips';
import { useRecentActivities } from '../hooks/useRecentActivity';
import { DashboardLoading } from '../components/dashboard/Dashboardloading';
import { DashboardError } from '../components/dashboard/DashboardError';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { TripStats } from '../components/dashboard/TripStats';
import { NextTrip } from '../components/dashboard/NextTrip';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TripControls } from '../components/dashboard/TripControls';
import { TripList } from '../components/dashboard/TripList';
import { Pagination } from '../components/dashboard/Pagination';
import { EmptyState } from '../components/dashboard/EmptyState';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { QuickViewModal } from '../components/dashboard/QuickViewModal';

import { filterTrips, sortTrips, paginateTrips, getTripStats, getNextTrip } from '../utils/tripUtils.jsx';

function Dashboard() {
  const { userName } = useUser();
  const { trips, loading, error, createTrip, deleteTrip, archiveTrip } = useTrips();
  const { activities } = useRecentActivities(3);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  if (loading) return <DashboardLoading />;
  if (error) return <DashboardError error={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      <Toaster position="top-right" />

      <WelcomeBanner userName={userName} total={stats.total} upcoming={stats.upcoming} />
      <TripStats stats={stats} />
      <NextTrip trip={nextTrip} />
      <QuickActions onNewTrip={handleCreateTrip} />

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
        <EmptyState onNewTrip={handleCreateTrip} />
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
    </div>
  );
}

export default Dashboard;