import React from 'react';
import { Plus, Plane, Hotel, Utensils, Compass } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'flight': return <Plane className="w-4 h-4" />;
    case 'hotel': return <Hotel className="w-4 h-4" />;
    case 'restaurant': return <Utensils className="w-4 h-4" />;
    default: return <Compass className="w-4 h-4" />;
  }
};

function ItineraryTab({ trip, onAddActivity }) {
  const groupActivitiesByDay = (activities) => {
    const grouped = {};
    activities.forEach(activity => {
      if (!grouped[activity.day]) grouped[activity.day] = [];
      grouped[activity.day].push(activity);
    });
    return grouped;
  };

  const groupedActivities = groupActivitiesByDay(trip?.activities || []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Itinerary</h3>
        <button
          onClick={onAddActivity}
          className="flex items-center gap-2 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>
      <div className="space-y-6">
        {Object.keys(groupedActivities).sort((a, b) => a - b).map(day => (
          <div key={day}>
            <h4 className="font-medium text-deep-charcoal dark:text-dark-text mb-2 flex items-center gap-2">
              <span className="text-sm text-warm-grey dark:text-dark-text-secondary">Day {day}</span>
              <span className="text-xs text-warm-grey dark:text-dark-text-secondary">
                ({new Date(new Date(trip.startDate).getTime() + (day - 1) * 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
              </span>
            </h4>
            <div className="space-y-2">
              {groupedActivities[day].map(activity => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border border-[#e8eaed] dark:border-dark-border rounded-lg hover:border-terracotta dark:hover:border-dark-terracotta transition-colors">
                  <span className="text-terracotta dark:text-dark-terracotta">{getActivityIcon(activity.type)}</span>
                  <span className="text-sm text-warm-grey dark:text-dark-text-secondary w-16">{activity.time}</span>
                  <span className="text-sm text-deep-charcoal dark:text-dark-text flex-1">{activity.title}</span>
                  <span className="text-xs text-warm-grey dark:text-dark-text-secondary capitalize bg-terracotta-soft dark:bg-dark-terracotta-soft px-2 py-0.5 rounded-full">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groupedActivities).length === 0 && (
          <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No activities added yet.</p>
        )}
      </div>
    </div>
  );
}

export default ItineraryTab;