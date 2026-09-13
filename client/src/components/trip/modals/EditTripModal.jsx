import React, { useState, useEffect } from 'react';
import { X, Loader, Save } from 'lucide-react';

export const EditTripModal = ({ isOpen, onClose, trip, onSave }) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetMembers, setTargetMembers] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && trip) {
      setName(trip.name || '');
      setDestination(trip.destination || '');
      setStartDate(trip.startDate ? trip.startDate.slice(0, 10) : '');
      setEndDate(trip.endDate ? trip.endDate.slice(0, 10) : '');
      setTargetMembers(trip.targetMembers || 1);
    }
  }, [isOpen, trip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!name.trim() || !destination.trim() || !startDate || !endDate) {
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        targetMembers: parseInt(targetMembers, 10) || 1,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed] dark:border-dark-border">
          <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
            Edit trip
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Trip name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Target members
            </label>
            <input
              type="number"
              min="1"
              value={targetMembers}
              onChange={(e) => setTargetMembers(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white font-medium hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-60 transition-colors"
            >
              {saving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;