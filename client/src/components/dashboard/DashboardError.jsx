import React from 'react';

export const DashboardError = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
    <div className="text-center">
      <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);