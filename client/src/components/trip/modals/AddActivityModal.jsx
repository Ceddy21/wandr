import React from 'react';
import { X } from 'lucide-react';

export const AddActivityModal = ({ isOpen, onClose, newActivity, setNewActivity, onAdd }) => {
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
        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Add Activity</h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Add a new activity to your itinerary.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Day</label>
            <select
              value={newActivity.day}
              onChange={(e) => setNewActivity({ ...newActivity, day: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
            >
              {[...Array(7)].map((_, i) => (
                <option key={i} value={i + 1}>Day {i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Time</label>
            <input
              type="text"
              placeholder="9:00 AM"
              value={newActivity.time}
              onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Activity Title</label>
            <input
              type="text"
              placeholder="e.g. Beach Tour"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Type</label>
            <select
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
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
              className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
            >
              Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};