import React, { useState } from 'react';
import { Plus, Clock, MapPin, Plane, Hotel, Coffee, Calendar as CalendarIcon } from 'lucide-react';

function ItineraryTab({ trip, onAddActivity }) {
  const [expandedDay, setExpandedDay] = useState(null);

  const activities = trip?.activities || [];

  const groupActivitiesByDay = () => {
    const grouped = {};
    activities.forEach((activity) => {
      const day = `Day ${activity.day}`;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(activity);
    });
    return grouped;
  };

  const groupedActivities = groupActivitiesByDay();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'restaurant': return <Coffee className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'flight': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'hotel': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'restaurant': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
          Itinerary
        </h3>
        <button
          onClick={onAddActivity}
          className="flex items-center gap-1 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      {Object.keys(groupedActivities).length === 0 ? (
        <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
          <p>No activities planned yet. Start building your itinerary!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedActivities).map(([day, dayActivities]) => (
            <div key={day} className="border border-[#e8eaed] dark:border-dark-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDay(day)}
                className="w-full px-4 py-3 flex items-center justify-between bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 hover:bg-terracotta-soft/50 dark:hover:bg-dark-terracotta-soft/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                  <span className="font-medium text-deep-charcoal dark:text-dark-text">{day}</span>
                  <span className="text-xs text-warm-grey dark:text-dark-text-secondary">
                    ({dayActivities.length} activities)
                  </span>
                </div>
                <span className="text-warm-grey dark:text-dark-text-secondary">
                  {expandedDay === day ? '▲' : '▼'}
                </span>
              </button>
              {expandedDay === day && (
                <div className="divide-y divide-[#e8eaed] dark:divide-dark-border">
                  {dayActivities.map((activity) => (
                    <div key={activity._id || activity.id} className="flex items-start gap-3 px-4 py-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">
                            {activity.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                          <span className="capitalize">{activity.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItineraryTab;