import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Filter, Calendar, Users, DollarSign, MapPin, MessageCircle, Plus, Clock, ChevronDown, UserPlus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTrip, setFilterTrip] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const trips = [
    { id: 1, name: 'Bora 2025 with Friends' },
    { id: 2, name: 'Siargao Surf Trip' },
    { id: 3, name: 'El Nido Escape' }
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // --- REPLACE WITH REAL API CALL ---
        // const response = await fetch('/api/activities');
        // const data = await response.json();
        // setActivities(data);

        // --- MOCK DATA ---
        const mockActivities = [
          {
            id: 1,
            type: 'expense_added',
            user: { id: 1, name: 'Maya' },
            trip: { id: 1, name: 'Bora 2025 with Friends' },
            description: 'added ₱500 for food',
            amount: 500,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          },
          {
            id: 2,
            type: 'member_added',
            user: { id: 2, name: 'Alex' },
            trip: { id: 1, name: 'Bora 2025 with Friends' },
            description: 'added Sophie to the trip',
            createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          },
          {
            id: 3,
            type: 'activity_added',
            user: { id: 3, name: 'Sophie' },
            trip: { id: 2, name: 'Siargao Surf Trip' },
            description: 'added "Surfing Lesson" to itinerary',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          },
          {
            id: 4,
            type: 'trip_created',
            user: { id: 4, name: 'Tom' },
            trip: { id: 3, name: 'El Nido Escape' },
            description: 'created the trip',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: 5,
            type: 'poll_created',
            user: { id: 1, name: 'Maya' },
            trip: { id: 1, name: 'Bora 2025 with Friends' },
            description: 'created poll "Where to eat?"',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          },
          {
            id: 6,
            type: 'expense_added',
            user: { id: 2, name: 'Alex' },
            trip: { id: 2, name: 'Siargao Surf Trip' },
            description: 'added ₱1500 for hotel',
            amount: 1500,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
          },
          {
            id: 7,
            type: 'member_added',
            user: { id: 3, name: 'Sophie' },
            trip: { id: 3, name: 'El Nido Escape' },
            description: 'added Liam to the trip',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
          },
        ];
        setActivities(mockActivities);
      } catch (err) {
        toast.error('Failed to load activities');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesTrip = filterTrip === 'all' || activity.trip.id === parseInt(filterTrip);
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesTrip && matchesType;
  });

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    activities.forEach(activity => {
      const date = new Date(activity.createdAt);
      let label;
      if (date >= today) {
        label = 'Today';
      } else if (date >= yesterday) {
        label = 'Yesterday';
      } else if (date >= weekStart) {
        label = 'This Week';
      } else {
        label = 'Older';
      }
      if (!groups[label]) groups[label] = [];
      groups[label].push(activity);
    });

    const order = ['Today', 'Yesterday', 'This Week', 'Older'];
    const sortedGroups = {};
    order.forEach(key => {
      if (groups[key]) sortedGroups[key] = groups[key];
    });
    return sortedGroups;
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'expense_added': return <DollarSign className="w-4 h-4" />;
      case 'member_added': return <UserPlus className="w-4 h-4" />;
      case 'activity_added': return <MapPin className="w-4 h-4" />;
      case 'trip_created': return <Plus className="w-4 h-4" />;
      case 'poll_created': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'expense_added': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'member_added': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'activity_added': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'trip_created': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'poll_created': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const formatTime = (date) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-terracotta dark:text-dark-terracotta">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text flex items-center gap-2">
            <Activity className="w-7 h-7 text-terracotta dark:text-dark-terracotta" />
            Recent Activity
          </h1>
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
            {filteredActivities.length} activities across your trips
          </p>
        </div>
        <Link to="/dashboard" className="text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1">
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
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.name}</option>
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
            <option value="expense_added">Expenses</option>
            <option value="member_added">Members</option>
            <option value="activity_added">Activities</option>
            <option value="trip_created">Trips</option>
            <option value="poll_created">Polls</option>
          </select>
        </div>
      </div>

      {Object.keys(groupedActivities).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([groupLabel, groupActivities]) => (
            <div key={groupLabel}>
              <h2 className="text-sm font-semibold text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {groupLabel}
              </h2>
              <div className="space-y-3">
                {groupActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-deep-charcoal dark:text-dark-text">
                            <strong className="font-medium">{activity.user.name}</strong>
                            {' '}
                            {activity.description}
                            {' '}
                            <span className="text-terracotta dark:text-dark-terracotta font-medium">
                              {activity.trip.name}
                            </span>
                          </p>
                          <span className="text-xs text-warm-grey dark:text-dark-text-secondary whitespace-nowrap">
                            {formatTime(activity.createdAt)}
                          </span>
                        </div>
                        {activity.type === 'expense_added' && activity.amount && (
                          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
                            ₱{activity.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">No activity found</h3>
          <p className="text-warm-grey dark:text-dark-text-secondary mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

export default RecentActivity;