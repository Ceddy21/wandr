import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive as ArchiveIcon,
  RotateCcw,
  Trash2,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Activity,
  Eye,            
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { useTrips } from '../hooks/useTrips';
import { DashboardLoading } from '../components/dashboard/DashboardLoading';
import { getStatusColor, getStatusLabel, formatDateRange } from '../utils/statusUtils';
import { QuickViewModal } from '../components/dashboard/QuickViewModal';

function Archive() {
  const { trips, loading, deleteTrip, unarchiveTrip } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(null);   

  const archivedTrips = trips.filter((trip) => trip.status === 'archived');

  const handleQuickView = (trip) => {
    setSelectedTrip(trip);
    setIsQuickViewOpen(true);
  };

  const handleRestore = async (tripId) => {
    setIsRestoring(tripId);
    try {
      await unarchiveTrip(tripId);
    } finally {
      setIsRestoring(null);
    }
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text flex items-center gap-2">
            <ArchiveIcon className="w-7 h-7 text-terracotta dark:text-dark-terracotta" />
            Archived Trips
          </h1>
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
            {archivedTrips.length} {archivedTrips.length === 1 ? 'trip' : 'trips'} archived
          </p>
        </div>
        <Link
          to="/dashboard"
          className="text-sm text-terracotta dark:text-dark-terracotta hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {archivedTrips.length === 0 ? (
        <div className="text-center py-16">
          <ArchiveIcon className="w-16 h-16 mx-auto mb-4 text-terracotta dark:text-dark-terracotta opacity-60" />
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
            No archived trips
          </h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2">
            Archived trips will appear here.
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-4 px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {archivedTrips.map((trip) => {
            const memberCount = Array.isArray(trip.members)
              ? trip.members.length
              : trip.targetMembers || 0;
            const activityCount = Array.isArray(trip.activities)
              ? trip.activities.length
              : 0;

            return (
              <div
                key={trip._id}
                className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300 flex flex-col opacity-90"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-semibold text-deep-charcoal dark:text-dark-text truncate">
                      {trip.name || trip.destination}
                    </h3>
                    {trip.destination && (
                      <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{trip.destination}</span>
                      </p>
                    )}
                    <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(trip.status)}`}>
                    {getStatusLabel(trip.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#e8eaed] dark:border-dark-border">
                  <div className="flex items-center gap-3 text-xs text-warm-grey dark:text-dark-text-secondary">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      {activityCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuickView(trip)}
                      className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft hover:text-terracotta transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleRestore(trip._id)}
                      disabled={isRestoring === trip._id}
                      className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Restore"
                    >
                      <RotateCcw className={`w-4 h-4 ${isRestoring === trip._id ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => deleteTrip(trip._id)}
                      className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        trip={selectedTrip}
      />
    </div>
  );
}

export default Archive;