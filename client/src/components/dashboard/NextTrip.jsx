import React from 'react';
import { MapPin, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { formatDateRange, daysRemaining } from '../../utils/statusUtils.jsx';

export const NextTrip = ({ trip }) => {
  if (!trip) return null;

  return (
    <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-terracotta/5 to-[#2D6A4F]/5 dark:from-dark-terracotta/5 dark:to-[#E76F51]/5 rounded-xl border border-[#e8eaed] dark:border-dark-border">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="p-2.5 sm:p-3 rounded-xl bg-terracotta/10 dark:bg-dark-terracotta/10 flex-shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta dark:text-dark-terracotta" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-terracotta dark:text-dark-terracotta uppercase tracking-wider">
              Next Up
            </p>
            <h3 className="text-base sm:text-xl font-serif font-semibold text-deep-charcoal dark:text-dark-text truncate">
              {trip.name || trip.destination}
            </h3>
            <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-1.5 mt-0.5">
              <CalendarIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{formatDateRange(trip.startDate, trip.endDate)}</span>
            </p>
            <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{daysRemaining(trip.startDate)} days to go!</span>
            </p>
          </div>
        </div>

        <a
          href={`/trip/${trip._id}`}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-105 whitespace-nowrap flex-shrink-0 self-center"
        >
          <span className="hidden sm:inline">View Details</span>
          <span className="sm:hidden">View</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>
    </div>
  );
};