import React from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

export const QuickActions = ({ onNewTrip }) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
    <button
      onClick={onNewTrip}
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
);