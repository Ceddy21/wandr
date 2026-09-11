import React from 'react';
import {
  Users,
  Activity,
  Calendar as CalendarIcon,
  Eye,
  Archive,
  Trash2,
  MapPin,
} from 'lucide-react';
import {
  getStatusColor,
  getStatusLabel,
  formatDateRange,
} from '../../utils/statusUtils';

export const TripList = ({
  trips,
  viewMode,
  onQuickView,
  onArchive,
  onDelete,
}) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="text-center py-8 text-warm-grey dark:text-dark-text-secondary">
        No trips to display
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
          : 'flex flex-col gap-3'
      }
    >
      {trips.map((trip) => {
        const memberCount = Array.isArray(trip.members)
          ? trip.members.length
          : trip.targetMembers || 0;

        const activityCount = Array.isArray(trip.activities)
          ? trip.activities.length
          : 0;

        return (
          <div
            key={trip._id}
            className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 hover:border-terracotta dark:hover:border-dark-terracotta hover:shadow-md transition-all duration-300 group flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="min-w-0 flex-1">
                <a href={`/trip/${trip._id}`} className="block">
                  <h3 className="font-serif text-lg font-semibold text-deep-charcoal dark:text-dark-text group-hover:text-terracotta dark:group-hover:text-dark-terracotta transition-colors truncate">
                    {trip.name || trip.destination || 'Untitled Trip'}
                  </h3>
                </a>

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

              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(
                  trip.status
                )}`}
              >
                {getStatusLabel(trip.status)}
              </span>
            </div>

            {trip.status === 'ongoing' && (
              <div className="mt-3 w-full">
                <div className="flex items-center justify-between text-xs text-warm-grey dark:text-dark-text-secondary mb-1">
                  <span>Progress</span>
                  <span>{trip.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#e8eaed] dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta dark:bg-dark-terracotta rounded-full transition-all duration-500"
                    style={{ width: `${trip.progress || 0}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#e8eaed] dark:border-dark-border">
              {/* Left: Counts */}
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
                  onClick={() => onQuickView(trip)}
                  className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onArchive(trip._id)}
                  className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
                  title="Archive"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(trip._id)}
                  className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};