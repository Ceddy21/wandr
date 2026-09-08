import React from 'react';
import { Users, Activity, Calendar as CalendarIcon, Eye, Archive, Trash2 } from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDateRange } from '../../utils/statusUtils.jsx';

export const TripList = ({ trips, viewMode, onQuickView, onArchive, onDelete }) => (
  <div className={viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
    : 'flex flex-col gap-3'
  }>
    {trips.map((trip) => (
      <div
        key={trip._id}
        className={`bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 hover:border-terracotta dark:hover:border-dark-terracotta hover:shadow-md transition-all duration-300 group flex flex-col ${
          viewMode === 'list' ? 'flex-row items-center' : ''
        }`}
      >
        <div className={`flex flex-col w-full ${viewMode === 'list' ? 'flex-1 flex-row items-center flex-wrap gap-4' : 'h-full'}`}>
          <div className={`flex items-start ${viewMode === 'list' ? 'flex-1 min-w-[200px]' : ''} justify-between w-full`}>
            <div>
              <a href={`/trip/${trip._id}`}>
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
                <span>{trip.progress || 0}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#e8eaed] dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-terracotta dark:bg-dark-terracotta rounded-full transition-all duration-500"
                  style={{ width: `${trip.progress || 0}%` }}
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
                {trip.activities || 0} activities
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onQuickView(trip)}
                className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onArchive(trip._id)}
                className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(trip._id)}
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
);