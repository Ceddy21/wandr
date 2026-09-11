import React, { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';

const DEFAULT_ACTIVITY = {
  day: 1,
  time: '9:00 AM',
  title: '',
  type: 'activity',
};

const to24Hour = (time12) => {
  if (!time12) return '';

  const hhmm = time12.match(/^(\d{1,2}):(\d{2})/);
  if (hhmm && !/AM|PM/i.test(time12)) {
    return `${String(hhmm[1]).padStart(2, '0')}:${hhmm[2]}`;
  }

  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${minute}`;
};

const to12Hour = (time24) => {
  if (!time24) return '';

  if (/AM|PM/i.test(time24)) return time24;

  const trimmed = time24.slice(0, 5);
  const [hourStr, minute] = trimmed.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  return `${hour}:${minute} ${period}`;
};

export const AddActivityModal = ({
  isOpen,
  onClose,
  newActivity,                         
  setNewActivity,                       
  onAdd,
}) => {
  const safeActivity = newActivity || DEFAULT_ACTIVITY;
  const safeSetActivity = setNewActivity || (() => {});

  const [timeValue, setTimeValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeValue(to24Hour(safeActivity.time));
    }
  }, [isOpen, safeActivity.time]);

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTimeValue(val);
    safeSetActivity({ ...safeActivity, time: to12Hour(val) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">
          Add Activity
        </h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
          Add a new activity to your itinerary.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Day
            </label>
            <select
              value={safeActivity.day}
              onChange={(e) =>
                safeSetActivity({
                  ...safeActivity,
                  day: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              {[...Array(7)].map((_, i) => (
                <option key={i} value={i + 1}>
                  Day {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              <Clock className="w-4 h-4" /> Time
            </label>
            <input
              type="time"
              step="60"
              value={timeValue}
              onChange={handleTimeChange}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Activity Title
            </label>
            <input
              type="text"
              placeholder="e.g. Beach Tour"
              value={safeActivity.title}
              onChange={(e) =>
                safeSetActivity({ ...safeActivity, title: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Type
            </label>
            <select
              value={safeActivity.type}
              onChange={(e) =>
                safeSetActivity({ ...safeActivity, type: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="activity">Activity</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
            >
              Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;