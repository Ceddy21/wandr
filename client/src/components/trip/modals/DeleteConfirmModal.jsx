import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, tripName }) => {
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
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Delete Trip</h2>
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
            Are you sure you want to delete "<strong>{tripName}</strong>"?
            This action cannot be undone and all trip data will be permanently removed.
          </p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};