import React, { useState } from 'react';
import { X, LogOut, Loader } from 'lucide-react';

export const LeaveTripModal = ({ isOpen, onClose, onConfirm, tripName }) => {
  const [leaving, setLeaving] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (leaving) return;
    setLeaving(true);
    try {
      await onConfirm();
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => !leaving && onClose()}
    >
      <div
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed] dark:border-dark-border">
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
              Leave trip
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={leaving}
            className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-deep-charcoal dark:text-dark-text">
            Are you sure you want to leave{' '}
            <strong className="font-semibold">{tripName || 'this trip'}</strong>?
          </p>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              You will lose access to this trip's itinerary, expenses, chat, and polls. You can rejoin later using the share code.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={leaving}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={leaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-60 transition-colors"
            >
              {leaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Leaving...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Leave trip
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTripModal;