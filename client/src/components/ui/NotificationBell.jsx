import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, Loader } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import {
  getActivityIcon,
  getActivityColor,
  getActivityLink,
  formatTime,
} from '../../utils/activityUtils.jsx';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Pull real data — same hook used by /notifications page
  const {
    allActivities,
    loading,
    unreadCount,
    markRead,
    markAllRead,
  } = useNotifications({ filter: 'all', page: 1, perPage: 5 });

  // Show only the 5 most recent
  const preview = allActivities.slice(0, 5);

  // ─── Close on outside click ─────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ─── Close on Escape ────────────────────────────────────
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markRead(notif._id);
    const link = getActivityLink(notif);
    setIsOpen(false);
    if (link) navigate(link);
  };

  const handleMarkAll = async (e) => {
    e.stopPropagation();
    await markAllRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ─── Bell button ─────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
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

      {/* ─── Dropdown ────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8eaed] dark:border-dark-border">
            <h3 className="font-semibold text-deep-charcoal dark:text-dark-text">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-terracotta dark:text-dark-terracotta hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-72 overflow-y-auto divide-y divide-[#e8eaed] dark:divide-dark-border">
            {loading ? (
              <div className="p-6 flex justify-center">
                <Loader className="w-5 h-5 animate-spin text-terracotta dark:text-dark-terracotta" />
              </div>
            ) : preview.length === 0 ? (
              <div className="p-4 text-center text-sm text-warm-grey dark:text-dark-text-secondary">
                No notifications yet
              </div>
            ) : (
              preview.map((notif) => {
                const link = getActivityLink(notif);
                return (
                  <button
                    key={notif._id}
                    type="button"
                    disabled={!link}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors disabled:cursor-default ${
                      !notif.isRead
                        ? 'bg-terracotta-soft/10 dark:bg-dark-terracotta-soft/10 hover:bg-terracotta-soft/20 dark:hover:bg-dark-terracotta-soft/20'
                        : 'hover:bg-[#F8F9FA] dark:hover:bg-dark-card/50'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(
                        notif.type
                      )}`}
                    >
                      {getActivityIcon(notif.type, 'w-4 h-4')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-deep-charcoal dark:text-dark-text break-words">
                        <strong className="font-medium">
                          {notif.userName || 'Someone'}
                        </strong>{' '}
                        {notif.description}{' '}
                        <span className="text-terracotta dark:text-dark-terracotta font-medium">
                          {notif.tripName || 'a trip'}
                        </span>
                      </p>
                      <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-0.5">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>

                    {!notif.isRead && (
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
                        className="flex-shrink-0 p-1 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#e8eaed] dark:border-dark-border px-4 py-2.5 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
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