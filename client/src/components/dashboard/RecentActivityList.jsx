import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { getActivityIcon, getActivityColor, formatTime } from '../../utils/activityUtils.jsx';

export const RecentActivityList = ({ activities }) => {
  return (
    <div className="mt-8 border-t border-[#e8eaed] dark:border-dark-border pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text flex items-center gap-2">
          <Activity className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
          Recent Activity
        </h2>
        <Link
          to="/activity"
          className="text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1"
        >
          View All →
        </Link>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <div
              key={activity._id || activity.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-lg hover:border-terracotta/30 dark:hover:border-dark-terracotta/30 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-deep-charcoal dark:text-dark-text truncate">
                  <strong className="font-medium">{activity.user?.name || 'Unknown'}</strong>
                  {' '}
                  {activity.description}
                  {' '}
                  <span className="text-terracotta dark:text-dark-terracotta font-medium">
                    {activity.trip?.name || 'Trip'}
                  </span>
                </p>
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
          <p>No recent activity yet.</p>
        </div>
      )}
    </div>
  );
};