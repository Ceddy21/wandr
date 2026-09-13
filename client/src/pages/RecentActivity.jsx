import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Filter,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { activityService } from '../services/activityService';
import {
  getActivityIcon,
  getActivityColor,
  getActivityLink,
  formatRelativeTime,
} from '../utils/ActivityHelpers';

function RecentActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTrip, setFilterTrip] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesData, tripsData] = await Promise.all([
          activityService.getFiltered({
            tripId: filterTrip,
            type: filterType,
            limit: 200,
          }),
          activityService.getTrips(),
        ]);
        setActivities(activitiesData);
        setTrips(tripsData);
      } catch (err) {
        toast.error(err.message || 'Failed to load activities');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterTrip, filterType]);

  const groupActivitiesByDate = (items) => {
    const groups = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    items.forEach((activity) => {
      const date = new Date(activity.createdAt);
      let label;
      if (date >= today) label = 'Today';
      else if (date >= yesterday) label = 'Yesterday';
      else if (date >= weekStart) label = 'This Week';
      else label = 'Older';

      if (!groups[label]) groups[label] = [];
      groups[label].push(activity);
    });

    const order = ['Today', 'Yesterday', 'This Week', 'Older'];
    const sorted = {};
    order.forEach((key) => {
      if (groups[key]) sorted[key] = groups[key];
    });
    return sorted;
  };

  const groupedActivities = groupActivitiesByDate(activities);

  const handleActivityClick = (activity) => {
    const link = getActivityLink(activity);
    if (link) navigate(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-terracotta dark:text-dark-terracotta">
          Loading activity...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text flex items-center gap-2">
            <Activity className="w-7 h-7 text-terracotta dark:text-dark-terracotta" />
            Recent Activity
          </h1>
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
            {activities.length} activities across your trips
          </p>
        </div>
        <Link
          to="/dashboard"
          className="text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-xs">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <select
            value={filterTrip}
            onChange={(e) => setFilterTrip(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
          >
            <option value="all">All Trips</option>
            {trips.map((trip) => (
              <option key={trip._id} value={trip._id}>
                {trip.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
          >
            <option value="all">All Types</option>

            <optgroup label="Expenses">
              <option value="expense_added">Expense added</option>
              <option value="expense_updated">Expense updated</option>
              <option value="expense_deleted">Expense deleted</option>
            </optgroup>

            <optgroup label="Itinerary">
              <option value="activity_added">Itinerary added</option>
              <option value="activity_updated">Itinerary updated</option>
              <option value="activity_deleted">Itinerary deleted</option>
            </optgroup>

            <optgroup label="Members">
              <option value="member_added">Member added</option>
              <option value="member_removed">Member removed</option>
            </optgroup>

            <optgroup label="Polls">
              <option value="poll_created">Poll created</option>
              <option value="poll_deleted">Poll deleted</option>
              <option value="poll_option_added">Poll option added</option>
              <option value="poll_option_deleted">Poll option deleted</option>
            </optgroup>

            <optgroup label="Chat">
              <option value="message_sent">Message sent</option>
              <option value="message_edited">Message edited</option>
              <option value="message_deleted">Message deleted</option>
            </optgroup>

            <optgroup label="Trip">
              <option value="trip_created">Trip created</option>
              <option value="trip_archived">Trip archived</option>
              <option value="trip_unarchived">Trip unarchived</option>
            </optgroup>
          </select>
        </div>
      </div>

      {Object.keys(groupedActivities).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([label, items]) => (
            <div key={label}>
              <h2 className="text-sm font-semibold text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {label}
              </h2>
              <div className="space-y-3">
                {items.map((activity) => {
                  const link = getActivityLink(activity);
                  return (
                    <button
                      key={activity._id}
                      type="button"
                      onClick={() => handleActivityClick(activity)}
                      disabled={!link}
                      className="w-full text-left bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 hover:shadow-md hover:border-[#2D6A4F] dark:hover:border-[#E76F51] hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-default disabled:hover:shadow-sm disabled:hover:border-[#e8eaed] disabled:hover:translate-y-0 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type, 'w-4 h-4')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-deep-charcoal dark:text-dark-text">
                              <strong className="font-medium">
                                {activity.userName}
                              </strong>{' '}
                              {activity.description}{' '}
                              <span className="text-terracotta dark:text-dark-terracotta font-medium">
                                {activity.tripName}
                              </span>
                            </p>
                            <span className="text-xs text-warm-grey dark:text-dark-text-secondary whitespace-nowrap">
                              {formatRelativeTime(activity.createdAt)}
                            </span>
                          </div>
                          {activity.amount > 0 && activity.type.startsWith('expense_') && (
                            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
                              ₱{activity.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                        {link && (
                          <ChevronRight className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 self-center" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <Activity className="w-16 h-16 text-terracotta dark:text-dark-terracotta opacity-60" />
          </div>
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
            No activity found
          </h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}

export default RecentActivity;