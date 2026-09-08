import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="w-2/3">
            <Skeleton height={24} />
            <Skeleton height={16} className="mt-2" />
          </div>
          <Skeleton width={60} height={20} borderRadius={999} />
        </div>
        <Skeleton height={4} className="mt-3" />
        <div className="mt-3 flex items-center gap-3">
          <Skeleton width={80} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <div className="mt-3 flex items-center gap-1">
          <Skeleton circle width={24} height={24} />
          <Skeleton circle width={24} height={24} />
          <Skeleton circle width={24} height={24} />
          <Skeleton circle width={24} height={24} />
        </div>
      </div>
    ))}
  </div>
);