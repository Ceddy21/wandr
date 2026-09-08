import React from 'react';
import { X, Search, Loader, UserPlus, UserX } from 'lucide-react';

export const AddMembersModal = ({
  isOpen,
  onClose,
  trip,
  memberSearch,
  setMemberSearch,
  memberSuggestions,
  isSearchingMembers,
  onAddMember,
  onRemoveMember,
}) => {
  if (!isOpen) return null;

  const members = Array.isArray(trip?.members) ? trip.members : [];
  const memberCount = members.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>
        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Add Members</h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Search and invite friends to join this trip.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Search for friends</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
              <input
                type="text"
                placeholder="Type a name..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
              />
              {isSearchingMembers && (
                <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta dark:text-dark-terracotta animate-spin" />
              )}
            </div>
          </div>
          {memberSuggestions.length > 0 && (
            <div className="border border-[#e8eaed] dark:border-dark-border rounded-lg divide-y divide-[#e8eaed] dark:divide-dark-border max-h-48 overflow-y-auto">
              {memberSuggestions.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center">
                      <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">
                        {user.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{user.name}</p>
                      <p className="text-xs text-warm-grey dark:text-dark-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddMember(user)}
                    className="p-1.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {memberSearch.length >= 2 && memberSuggestions.length === 0 && !isSearchingMembers && (
            <div className="text-center py-4 text-warm-grey dark:text-dark-text-secondary">No users found</div>
          )}
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-2">
              Current Members ({memberCount})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between px-3 py-2 bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center">
                      <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">
                        {member.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text">
                        {member.name}
                        {member.role === 'admin' && (
                          <span className="ml-2 text-xs text-terracotta dark:text-dark-terracotta">(Admin)</span>
                        )}
                      </p>
                      <p className="text-xs text-warm-grey dark:text-dark-text-secondary">{member.email}</p>
                    </div>
                  </div>
                  {member.role !== 'admin' && (
                    <button
                      onClick={() => onRemoveMember(member._id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <UserX className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};