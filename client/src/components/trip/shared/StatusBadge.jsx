import React from 'react';

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400',
  archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400',
};

const statusLabels = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
  archived: 'Archived',
};

export const StatusBadge = ({ status }) => {
  const color = statusColors[status] || statusColors.upcoming;
  const label = statusLabels[status] || status;

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
};