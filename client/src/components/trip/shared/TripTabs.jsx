import React from 'react';

const TABS = ['itinerary', 'expenses', 'chat', 'polls'];

export const TripTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-[#e8eaed] dark:border-dark-border mb-6 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
            activeTab === tab
              ? 'border-terracotta text-terracotta dark:border-dark-terracotta dark:text-dark-terracotta'
              : 'border-transparent text-warm-grey dark:text-dark-text-secondary hover:text-deep-charcoal dark:hover:text-dark-text'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};