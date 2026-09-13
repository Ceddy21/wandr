import React, { useState } from 'react';
import {
  Plus, Clock, MapPin, Plane, Hotel, Coffee,
  Calendar as CalendarIcon, Pencil, Trash2,
  Check, Loader,
} from 'lucide-react';
import { EditActivityModal } from './modals/EditActivityModal';
import { ConfirmModal } from './modals/ConfirmModals';

function ItineraryTab({
  trip,
  itinerary = [],
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const groupedActivities = itinerary.reduce((groups, item) => {
    const day = `Day ${item.day}`;
    if (!groups[day]) groups[day] = [];
    groups[day].push(item);
    return groups;
  }, {});

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

  const toggleDay = (day) => setExpandedDay(expandedDay === day ? null : day);

  const handleToggleComplete = async (activity) => {
    if (togglingId) return; 
    setTogglingId(activity._id);
    try {
      await onUpdateActivity(activity._id, {
        completed: !activity.completed,
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingActivity) return;
    await onDeleteActivity(deletingActivity._id);
    setDeletingActivity(null);
  };

  const handleSaveEdit = async (updatedData) => {
    if (!editingActivity) return;
    const result = await onUpdateActivity(editingActivity._id, updatedData);
    if (result?.success) {
      setEditingActivity(null);
    }
  };

  const countCompleted = (items) => items.filter((i) => i.completed).length;

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
          {Object.entries(groupedActivities).map(([day, dayActivities]) => {
            const done = countCompleted(dayActivities);
            const total = dayActivities.length;

            return (
              <div
                key={day}
                className="border border-[#e8eaed] dark:border-dark-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleDay(day)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 hover:bg-terracotta-soft/50 dark:hover:bg-dark-terracotta-soft/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                    <span className="font-medium text-deep-charcoal dark:text-dark-text">
                      {day}
                    </span>
                    <span className="text-xs text-warm-grey dark:text-dark-text-secondary">
                      ({total} {total === 1 ? 'activity' : 'activities'}
                      {done > 0 && ` · ${done}/${total} done`})
                    </span>
                  </div>
                  <span className="text-warm-grey dark:text-dark-text-secondary">
                    {expandedDay === day ? '▲' : '▼'}
                  </span>
                </button>

                {expandedDay === day && (
                  <div className="divide-y divide-[#e8eaed] dark:divide-dark-border">
                    {dayActivities.map((activity) => {
                      const isDone = !!activity.completed;
                      const isToggling = togglingId === activity._id;

                      return (
                        <div
                          key={activity._id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F8F9FA] dark:hover:bg-dark-card/50 transition-colors group ${
                            isDone ? 'opacity-70' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(activity)}
                            disabled={isToggling}
                            aria-label={
                              isDone ? 'Mark as not completed' : 'Mark as completed'
                            }
                            className={`flex-shrink-0 mt-1.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                              isDone
                                ? 'bg-terracotta dark:bg-dark-terracotta border-terracotta dark:border-dark-terracotta'
                                : 'bg-transparent border-[#d1d5db] dark:border-dark-border hover:border-terracotta dark:hover:border-dark-terracotta'
                            } ${
                              isToggling
                                ? 'opacity-50 cursor-wait'
                                : 'cursor-pointer'
                            }`}
                          >
                            {isToggling ? (
                              <Loader className="w-3 h-3 animate-spin text-white" />
                            ) : isDone ? (
                              <Check
                                className="w-3 h-3 text-white"
                                strokeWidth={3}
                              />
                            ) : null}
                          </button>

                          <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(activity.type)}`}>
                            {getTypeIcon(activity.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium transition-all ${
                                isDone
                                  ? 'line-through text-warm-grey dark:text-dark-text-secondary'
                                  : 'text-deep-charcoal dark:text-dark-text'
                              }`}
                            >
                              {activity.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </span>
                              <span className="capitalize">{activity.type}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingActivity(activity)}
                              className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft hover:text-terracotta transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingActivity(activity)}
                              className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EditActivityModal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        trip={trip}
        activity={editingActivity}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        isOpen={!!deletingActivity}
        title="Delete Activity"
        message={`Are you sure you want to delete "${deletingActivity?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingActivity(null)}
      />
    </div>
  );
}

export default ItineraryTab;