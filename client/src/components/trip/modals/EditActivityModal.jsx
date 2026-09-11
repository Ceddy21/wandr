import React, { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';

const parseTime = (t) => {
  const fallback = { hour: '9', minute: '00', period: 'AM' };
  if (!t) return fallback;
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m) return { hour: String(parseInt(m[1], 10)), minute: m[2], period: m[3].toUpperCase() };
  const hhmm = t.match(/^(\d{1,2}):(\d{2})/);
  if (hhmm) {
    let h = parseInt(hhmm[1], 10);
    const period = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12; else if (h > 12) h -= 12;
    return { hour: String(h), minute: hhmm[2], period };
  }
  return fallback;
};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

export const EditActivityModal = ({ isOpen, onClose, activity, onSave }) => {
  const [form, setForm] = useState({
    day: 1, hour: '9', minute: '00', period: 'AM', title: '', type: 'activity',
  });

  useEffect(() => {
    if (isOpen && activity) {
      const p = parseTime(activity.time);
      setForm({
        day: activity.day || 1,
        hour: p.hour,
        minute: p.minute,
        period: p.period,
        title: activity.title || '',
        type: activity.type || 'activity',
      });
    }
  }, [isOpen, activity]);

  if (!isOpen || !activity) return null;

  const handleSave = () => {
    if (!form.title) return;
    onSave({
      day: parseInt(form.day) || 1,
      time: `${form.hour}:${form.minute} ${form.period}`,
      title: form.title,
      type: form.type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">
          Edit Activity
        </h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
          Update this activity's details.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Day</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              {[...Array(7)].map((_, i) => <option key={i} value={i + 1}>Day {i + 1}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              <Clock className="w-4 h-4" /> Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={form.hour}
                onChange={(e) => setForm({ ...form, hour: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-center text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              >
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select
                value={form.minute}
                onChange={(e) => setForm({ ...form, minute: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-center text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              >
                {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-center font-medium text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              >
                {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="activity">Activity</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};