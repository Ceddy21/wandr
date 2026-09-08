import React from 'react';
import { Plane } from 'lucide-react';

export const EmptyState = ({ onNewTrip }) => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-4">
      <Plane className="w-16 h-16 text-terracotta dark:text-dark-terracotta opacity-60" />
    </div>
    <h3 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
      No trips yet
    </h3>
    <p className="text-warm-grey dark:text-dark-text-secondary mt-2 max-w-md mx-auto">
      Start planning your next adventure with friends. Create your first trip and make memories together.
    </p>
    <button
      onClick={onNewTrip}
      className="mt-4 px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
    >
      + Create your first trip
    </button>
  </div>
);