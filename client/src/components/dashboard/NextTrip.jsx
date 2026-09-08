import React from 'react';
import { MapPin, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { formatDateRange, daysRemaining } from '../../utils/statusUtils.jsx';

export const NextTrip = ({ trip }) => {
  if (!trip) return null;

  return (
    <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-terracotta/5 to-[#2D6A4F]/5 dark:from-dark-terracotta/5 dark:to-[#E76F51]/5 rounded-xl border border-[#e8eaed] dark:border-dark-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-terracotta/10 dark:bg-dark-terracotta/10">
            <MapPin className="w-6 h-6 text-terracotta dark:text-dark-terracotta" />
          </div>
          <div>
            <p className="text-xs font-medium text-terracotta dark:text-dark-terracotta uppercase tracking-wider">Next Up</p>
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-deep-charcoal dark:text-dark-text">
              {trip.name || trip.destination}
            </h3>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
              <CalendarIcon className="w-3 h-3" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3" />
              {daysRemaining(trip.startDate)} days to go!
            </p>
          </div>
        </div>
        <a
          href={`/trip/${trip._id}`}
          className="flex items-center gap-2 px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};