import { DollarSign, UserPlus, MapPin, Activity, FileText } from 'lucide-react';

export const getActivityIcon = (type) => {
  switch (type) {
    case 'expense_added': return <DollarSign className="w-4 h-4" />;
    case 'member_added': return <UserPlus className="w-4 h-4" />;
    case 'activity_added': return <MapPin className="w-4 h-4" />;
    case 'trip_created': return <Activity className="w-4 h-4" />;
    case 'poll_created': return <FileText className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

export const getActivityColor = (type) => {
  switch (type) {
    case 'expense_added': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'member_added': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'activity_added': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'trip_created': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'poll_created': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
  }
};

export const formatTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};