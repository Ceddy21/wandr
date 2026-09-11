import React from 'react';
import { X, MapPin, Calendar as CalendarIcon, Users, Activity, DollarSign } from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDateRange } from '../../utils/statusUtils';

export const QuickViewModal = ({ trip, isOpen, onClose }) => {
  if (!isOpen || !trip) return null;

  const memberCount = Array.isArray(trip.members)
    ? trip.members.length
    : trip.targetMembers || 0;

  const activityCount = Array.isArray(trip.activities)
    ? trip.activities.length
    : 0;

  const totalExpenses = Array.isArray(trip.expenses)
    ? trip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-lg w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>

        <div className="flex flex-col items-start gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
              {getStatusLabel(trip.status)}
            </span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
            {trip.name || trip.destination || 'Untitled Trip'}
          </h3>
          {trip.destination && (
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {trip.destination}
            </p>
          )}
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {formatDateRange(trip.startDate, trip.endDate) || 'No dates set'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-terracotta dark:text-dark-terracotta" />
            <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Members</p>
            <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">{memberCount}</p>
          </div>
          <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center">
            <Activity className="w-4 h-4 mx-auto mb-1 text-terracotta dark:text-dark-terracotta" />
            <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Activities</p>
            <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">{activityCount}</p>
          </div>
          <div className="bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded-lg p-3 text-center col-span-2">
            <DollarSign className="w-4 h-4 mx-auto mb-1 text-terracotta dark:text-dark-terracotta" />
            <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Total Expenses</p>
            <p className="text-xl font-bold text-deep-charcoal dark:text-dark-text">
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        <a
          href={`/trip/${trip._id}`}
          className="w-full py-2.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors text-center block"
        >
          View Full Details
        </a>
      </div>
    </div>
  );
};