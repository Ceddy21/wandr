import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Share2, Edit, Trash2, UserPlus } from 'lucide-react';
import { MemberAvatar } from './MemberAvatar';
import { StatusBadge } from './StatusBadge';

export const TripInfoHeader = ({ trip, onDelete, onAddMembers }) => {
  const members = Array.isArray(trip.members) ? trip.members : [];
  const memberCount = members.length || trip.members || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors" title="Share">
            <Share2 className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          </button>
          <button className="p-2 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors" title="Edit">
            <Edit className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
                {trip.name || trip.destination}
              </h1>
              <StatusBadge status={trip.status} />
            </div>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {trip.destination}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} -
                {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.isArray(members) && members.slice(0, 5).map((member) => (
                <MemberAvatar key={member._id} member={member} />
              ))}
              {memberCount > 5 && (
                <div className="w-8 h-8 rounded-full bg-[#e8eaed] dark:bg-dark-border flex items-center justify-center border-2 border-white dark:border-dark-card">
                  <span className="text-xs text-warm-grey dark:text-dark-text-secondary">+{memberCount - 5}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
              {memberCount} members
            </span>
            <button
              onClick={onAddMembers}
              className="flex items-center gap-1 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};