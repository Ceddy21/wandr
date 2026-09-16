import React, { useState, useMemo } from 'react';
import { X, Crown, Loader, Search, Check } from 'lucide-react';
import { MemberAvatar } from '../shared/MemberAvatar';

export const TransferOwnershipModal = ({
  isOpen,
  onClose,
  onConfirm,
  trip,
  currentUserId,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState('');
  const [transferring, setTransferring] = useState(false);

  const eligibleMembers = useMemo(() => {
    if (!trip?.members) return [];
    const currentId = currentUserId?.toString();

    return trip.members.filter((m) => {
      const memberId = (m._id || m).toString();
      return memberId !== currentId;
    });
  }, [trip?.members, currentUserId]);

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return eligibleMembers;
    const q = search.toLowerCase();
    return eligibleMembers.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [eligibleMembers, search]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (transferring || !selectedUserId) return;
    setTransferring(true);
    try {
      await onConfirm(selectedUserId);
      setSelectedUserId(null);
      setSearch('');
      onClose();
    } finally {
      setTransferring(false);
    }
  };

  const handleClose = () => {
    if (transferring) return;
    setSelectedUserId(null);
    setSearch('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed] dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
              Transfer ownership
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={transferring}
            className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-deep-charcoal dark:text-dark-text">
            Choose a member to become the new owner. You will become a regular member afterward.
          </p>

          {eligibleMembers.length === 0 ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                There are no other members to transfer ownership to. Add a member first.
              </p>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={transferring}
                  className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all disabled:opacity-60"
                />
              </div>

              <div className="max-h-64 overflow-y-auto border border-[#e8eaed] dark:border-dark-border rounded-lg">
                {filteredMembers.length === 0 ? (
                  <p className="p-4 text-sm text-center text-warm-grey dark:text-dark-text-secondary">
                    No members match your search.
                  </p>
                ) : (
                  filteredMembers.map((member) => {
                    const memberId = (member._id || member).toString();
                    const isSelected = selectedUserId === memberId;

                    return (
                      <button
                        key={memberId}
                        type="button"
                        onClick={() => setSelectedUserId(memberId)}
                        disabled={transferring}
                        className={`w-full flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[#e8eaed] dark:border-dark-border transition-colors text-left ${
                          isSelected
                            ? 'bg-terracotta-soft dark:bg-dark-terracotta-soft'
                            : 'hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60'
                        } disabled:opacity-60`}
                      >
                        <MemberAvatar member={member} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text truncate">
                            {member.name || 'Unnamed'}
                          </p>
                          <p className="text-xs text-warm-grey dark:text-dark-text-secondary truncate">
                            {member.email || ''}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-terracotta dark:text-dark-terracotta flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleClose}
              disabled={transferring}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={transferring || !selectedUserId}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {transferring ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  Transfer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferOwnershipModal;