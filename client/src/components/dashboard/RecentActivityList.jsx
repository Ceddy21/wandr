import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ChevronRight } from 'lucide-react';
import {
  getActivityIcon,
  getActivityColor,
  getActivityLink,
  formatTime,
} from '../../utils/activityUtils.jsx';

export const RecentActivityList = ({ activities }) => {
  const navigate = useNavigate();

  const handleClick = (activity) => {
    const link = getActivityLink(activity);
    if (link) navigate(link);
  };

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
          {activities.slice(0, 3).map((activity) => {
            const link = getActivityLink(activity);
            const Wrapper = link ? 'button' : 'div';

            return (
              <Wrapper
                key={activity._id || activity.id}
                {...(link
                  ? {
                      type: 'button',
                      onClick: () => handleClick(activity),
                    }
                  : {})}
                className={`w-full text-left flex items-center gap-3 p-3 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-lg transition-all group ${
                  link
                    ? 'hover:border-terracotta/40 dark:hover:border-dark-terracotta/40 hover:shadow-sm hover:-translate-y-0.5'
                    : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-deep-charcoal dark:text-dark-text truncate">
                    <strong className="font-medium">
                      {activity.userName || 'Someone'}
                    </strong>{' '}
                    {activity.description}{' '}
                    <span className="text-terracotta dark:text-dark-terracotta font-medium">
                      {activity.tripName || 'Trip'}
                    </span>
                  </p>
                  <p className="text-xs text-warm-grey dark:text-dark-text-secondary">
                    {formatTime(activity.createdAt)}
                  </p>
                </div>

                {link && (
                  <ChevronRight className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                )}
              </Wrapper>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
          <p>No recent activity yet.</p>
        </div>
      )}
    </div>
  );
};