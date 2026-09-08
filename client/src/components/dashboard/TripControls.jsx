import React from 'react';
import { Search, Filter, ChevronDown, Grid3x3, List } from 'lucide-react';

export const TripControls = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
      <input
        type="text"
        placeholder="Search trips by destination..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
      />
    </div>

    <div className="relative">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="pl-10 pr-8 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
      >
        <option value="all">All Trips</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <div className="relative">
      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="pl-10 pr-8 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200 appearance-none"
      >
        <option value="date">Sort by Date</option>
        <option value="destination">Sort by Destination</option>
        <option value="members">Sort by Members</option>
      </select>
    </div>

    <div className="flex items-center gap-1 bg-black border border-[#e8eaed] dark:border-dark-border rounded-lg overflow-hidden p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === 'grid'
            ? 'bg-terracotta text-white dark:bg-dark-terracotta shadow-sm'
            : 'text-warm-grey dark:text-dark-text-secondary hover:bg-white/10'
        }`}
      >
        <Grid3x3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === 'list'
            ? 'bg-terracotta text-white dark:bg-dark-terracotta shadow-sm'
            : 'text-warm-grey dark:text-dark-text-secondary hover:bg-white/10'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  </div>
);