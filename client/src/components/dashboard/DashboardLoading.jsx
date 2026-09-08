import React from 'react';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Sparkles } from 'lucide-react';

export const DashboardLoading = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
    <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-terracotta/10 via-terracotta-soft/20 to-[#2D6A4F]/10 dark:from-dark-terracotta/10 dark:via-dark-terracotta-soft/20 dark:to-[#E76F51]/10 rounded-2xl border border-terracotta/20 dark:border-dark-terracotta/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-terracotta/20 dark:bg-dark-terracotta/20">
            <Sparkles className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-deep-charcoal dark:text-dark-text">
              Loading...
            </h2>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
              Loading your trips...
            </p>
          </div>
        </div>
      </div>
    </div>
    <LoadingSkeleton />
  </div>
);