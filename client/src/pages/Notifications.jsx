import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Filter,
  Check,
  BellOff,
  Loader,
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import {
  getActivityIcon,
  getActivityColor,
  getActivityLink,
  formatRelativeTime,
} from '../utils/ActivityHelpers';

const PER_PAGE = 10;

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const {
    activities,
    loading,
    unreadCount,
    total,
    totalPages,
    markRead,
    markAllRead,
  } = useNotifications({ filter, page, perPage: PER_PAGE });

  const handleClick = (notif) => {
    if (!notif.isRead) markRead(notif._id);
    const link = getActivityLink(notif);
    if (link) navigate(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      {/* Header */}
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
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-terracotta dark:text-dark-terracotta hover:underline"
            >
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

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-8 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
          {total} notification{total === 1 ? '' : 's'}
        </span>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-8 h-8 animate-spin text-terracotta dark:text-dark-terracotta" />
        </div>
      ) : total === 0 ? (
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
          {activities.map((notif) => {
            const link = getActivityLink(notif);
            return (
              <button
                key={notif._id}
                type="button"
                disabled={!link}
                onClick={() => handleClick(notif)}
                className={`w-full text-left flex items-start gap-4 p-4 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 disabled:cursor-default disabled:hover:shadow-none disabled:hover:translate-y-0 ${
                  !notif.isRead
                    ? 'border-l-4 border-l-terracotta dark:border-l-dark-terracotta'
                    : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 p-2.5 rounded-lg ${getActivityColor(
                    notif.type
                  )}`}
                >
                  {getActivityIcon(notif.type, 'w-5 h-5')}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-deep-charcoal dark:text-dark-text">
                    <strong className="font-medium">{notif.userName}</strong>{' '}
                    {notif.description}{' '}
                    <span className="text-terracotta dark:text-dark-terracotta font-medium">
                      {notif.tripName}
                    </span>
                  </p>
                  <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-0.5">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>

                {!notif.isRead && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        markRead(notif._id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          markRead(notif._id);
                        }
                      }}
                      className="p-1.5 rounded-full bg-terracotta/10 dark:bg-dark-terracotta/10 hover:bg-terracotta/20 dark:hover:bg-dark-terracotta/20 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-deep-charcoal dark:text-dark-text px-3">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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