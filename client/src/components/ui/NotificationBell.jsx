import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, DollarSign, UserPlus, MapPin, Plane, FileText, Activity } from 'lucide-react';

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
];

const getNotificationIcon = (type) => {
  const iconClass = 'w-4 h-4';
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

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => !n.read).length;

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#4A4A4A] dark:text-dark-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-terracotta dark:bg-dark-terracotta text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8eaed] dark:border-dark-border">
            <h3 className="font-semibold text-deep-charcoal dark:text-dark-text">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button className="text-xs text-terracotta dark:text-dark-terracotta hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#e8eaed] dark:divide-dark-border">
            {DEMO_NOTIFICATIONS.length === 0 ? (
              <div className="p-4 text-center text-sm text-warm-grey dark:text-dark-text-secondary">
                No notifications yet
              </div>
            ) : (
              DEMO_NOTIFICATIONS.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F8F9FA] dark:hover:bg-dark-card/50 transition-colors ${
                    !notif.read
                      ? 'bg-terracotta-soft/10 dark:bg-dark-terracotta-soft/10'
                      : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${getIconBgColor(
                      notif.type
                    )}`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-deep-charcoal dark:text-dark-text break-words">
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

                  {!notif.read && (
                    <button
                      className="flex-shrink-0 p-1 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#e8eaed] dark:border-dark-border px-4 py-2.5 text-center">
            <Link
              to="/notifications"
              className="text-sm text-terracotta dark:text-dark-terracotta hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;