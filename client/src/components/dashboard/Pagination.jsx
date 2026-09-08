import React from 'react';

export const Pagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-[#e8eaed] dark:border-dark-border">
      <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} trips
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-deep-charcoal dark:text-dark-text px-3">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-sm text-deep-charcoal dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-off-white dark:hover:bg-dark-card transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};