import React from 'react';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';

export const TripStats = ({ stats }) => {
  const { total, upcoming, ongoing, completed } = stats;

  const statItems = [
    { label: 'Total Trips', value: total, icon: Users, color: 'terracotta' },
    { label: 'Upcoming', value: upcoming, icon: Calendar, color: 'blue' },
    { label: 'Ongoing', value: ongoing, icon: Clock, color: 'green' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'gray' },
  ];

  const colorClasses = {
    terracotta: 'hover:border-terracotta dark:hover:border-dark-terracotta',
    blue: 'hover:border-blue-500 dark:hover:border-blue-400',
    green: 'hover:border-green-500 dark:hover:border-green-400',
    gray: 'hover:border-gray-500 dark:hover:border-gray-400',
  };

  const valueColors = {
    terracotta: 'text-deep-charcoal dark:text-dark-text',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-3 sm:p-4 text-center group transition-all duration-300 ${colorClasses[item.color]}`}
        >
          <p className={`text-2xl sm:text-3xl font-bold ${valueColors[item.color]}`}>
            {item.value}
          </p>
          <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center justify-center gap-1">
            <item.icon className="w-3 h-3" />
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};