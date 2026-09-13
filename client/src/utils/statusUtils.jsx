export const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ongoing':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'completed':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
    case 'archived':                                   // ← ADD
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming';
    case 'ongoing':
      return 'Ongoing';
    case 'completed':
      return 'Completed';
    case 'archived':                                  
      return 'Archived';
    default:
      return 'Unknown';
  }
};

export const formatDateRange = (start, end) => {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

export const daysRemaining = (date) => {
  if (!date) return 0;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};