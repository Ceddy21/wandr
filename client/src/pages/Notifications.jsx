import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Filter, Check, DollarSign, UserPlus, MapPin, Plane, FileText, Activity, BellOff } from 'lucide-react';

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    type: 'expense_added',
    sender: { name: 'Maya' },
    trip: { name: 'Bora 2025 with Friends' },
    description: 'added ₱500 for food',
    read: false,
  },
  {
    id: 2,
    type: 'member_added',
    sender: { name: 'Alex' },
    trip: { name: 'Bora 2025 with Friends' },
    description: 'added Sophie to the trip',
    read: false,
  },
  {
    id: 3,
    type: 'activity_added',
    sender: { name: 'Sophie' },
    trip: { name: 'Siargao Surf Trip' },
    description: 'added "Surfing Lesson" to itinerary',
    read: true,
  },
  {
    id: 4,
    type: 'trip_created',
    sender: { name: 'Tom' },
    trip: { name: 'El Nido Escape' },
    description: 'created the trip',
    read: false,
  },
  {
    id: 5,
    type: 'poll_created',
    sender: { name: 'Maya' },
    trip: { name: 'Bora 2025 with Friends' },
    description: 'created poll "Where to eat?"',
    read: true,
  },
  {
    id: 6,
    type: 'expense_added',
    sender: { name: 'Alex' },
    trip: { name: 'Siargao Surf Trip' },
    description: 'added ₱1,500 for hotel',
    read: false,
  },
];

const getNotificationIcon = (type) => {
  const iconClass = 'w-5 h-5';
  switch (type) {
    case 'expense_added':
      return <DollarSign className={iconClass} />;
    case 'member_added':
      return <UserPlus className={iconClass} />;
    case 'activity_added':
      return <MapPin className={iconClass} />;
    case 'trip_created':
      return <Plane className={iconClass} />;
    case 'poll_created':
      return <FileText className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
};

const getIconBgColor = (type) => {
  switch (type) {
    case 'expense_added':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'member_added':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'activity_added':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'trip_created':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'poll_created':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
  }
};

const Notifications = () => {
  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => !n.read).length;
  const filter = 'all';
  const currentPage = 1;
  const totalPages = 2;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text flex items-center gap-2">
            <Bell className="w-7 h-7 text-terracotta dark:text-dark-terracotta" />
            Notifications
          </h1>
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
            {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button className="text-sm text-terracotta dark:text-dark-terracotta hover:underline">
              Mark all as read
            </button>
          )}
          <Link
            to="/dashboard"
            className="text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <select
            value={filter}
            className="pl-10 pr-8 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
          {DEMO_NOTIFICATIONS.length} notifications
        </span>
      </div>

      {DEMO_NOTIFICATIONS.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <BellOff className="w-16 h-16 text-terracotta dark:text-dark-terracotta opacity-60" />
          </div>
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
            No notifications
          </h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2">
            You're all caught up!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {DEMO_NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl transition-all ${
                !notif.read
                  ? 'border-l-4 border-l-terracotta dark:border-l-dark-terracotta'
                  : ''
              }`}
            >
              <div
                className={`flex-shrink-0 p-2.5 rounded-lg ${getIconBgColor(
                  notif.type
                )}`}
              >
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-deep-charcoal dark:text-dark-text">
                  <strong className="font-medium">{notif.sender.name}</strong>
                  {' '}
                  {notif.description}
                  {' '}
                  <span className="text-terracotta dark:text-dark-terracotta font-medium">
                    {notif.trip.name}
                  </span>
                </p>
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-0.5">
                  2 hours ago
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!notif.read && (
                  <button
                    className="p-1.5 rounded-full bg-terracotta/10 dark:bg-dark-terracotta/10 hover:bg-terracotta/20 dark:hover:bg-dark-terracotta/20 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-deep-charcoal dark:text-dark-text px-3">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;