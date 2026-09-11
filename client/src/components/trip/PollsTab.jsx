import React, { useState } from 'react';
import { Plus, BarChart, Users, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function PollsTab({
  trip,
  polls = [],             
  currentUser,
  onCreatePoll,
  onDeletePoll,
  onAddChoice,
  onDeleteChoice,
  onVote,
}) {
  const currentUserId = currentUser?._id || currentUser?.id;

  const [addingChoiceFor, setAddingChoiceFor] = useState(null);
  const [newChoiceText, setNewChoiceText] = useState('');

  const handleVote = (pollId, optionText) => {
    onVote(pollId, optionText);
  };

  const getUserVote = (poll) => {
    if (!currentUserId) return null;
    return poll.votes?.find(
      (v) => v.userId?.toString() === currentUserId.toString()
    );
  };

  const getVotesForOption = (poll, optionText) => {
    return (poll.votes || []).filter((v) => v.optionText === optionText).length;
  };

  const getTotalVotes = (poll) => (poll.votes || []).length;

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleAddChoiceSubmit = async (pollId) => {
    if (!newChoiceText.trim()) return;
    const result = await onAddChoice(pollId, newChoiceText.trim());
    if (result?.success) {
      setNewChoiceText('');
      setAddingChoiceFor(null);
    }
  };

  const handleDeleteChoice = (pollId, choiceId) => {
    if (!window.confirm('Remove this choice?')) return;
    onDeleteChoice(pollId, choiceId);
  };

  const handleDeletePoll = (pollId, question) => {
    if (!window.confirm(`Delete poll "${question}"? This cannot be undone.`)) return;
    onDeletePoll(pollId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
          Polls
        </h3>
        <button
          onClick={onCreatePoll}
          className="flex items-center gap-1 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Poll
        </button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
          <BarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No polls yet. Create one to get feedback from the group!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            const pollId = poll._id;
            const totalVotes = getTotalVotes(poll);
            const userVote = getUserVote(poll);
            const isPollCreator =
              currentUserId &&
              poll.createdById?.toString() === currentUserId.toString();

            return (
              <div
                key={pollId}
                className="border border-[#e8eaed] dark:border-dark-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h4 className="font-medium text-deep-charcoal dark:text-dark-text break-words">
                      {poll.question}
                    </h4>
                    <p className="text-xs text-warm-grey dark:text-dark-text-secondary flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      {totalVotes} vote{totalVotes !== 1 ? 's' : ''} • Created by{' '}
                      {poll.createdBy}
                    </p>
                  </div>

                  {isPollCreator && (
                    <button
                      onClick={() => handleDeletePoll(pollId, poll.question)}
                      className="p-1.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Delete poll"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {poll.options?.map((option) => {
                    const optionId = option._id;
                    const votes = getVotesForOption(poll, option.text);
                    const percentage = calculatePercentage(votes, totalVotes);
                    const isMyChoice =
                      currentUserId &&
                      option.addedBy?.toString() === currentUserId.toString();
                    const isMyVote = userVote?.optionText === option.text;

                    return (
                      <div key={optionId} className="relative group/opt">
                        <button
                          onClick={() => handleVote(pollId, option.text)}
                          className={`w-full text-left relative rounded-lg transition-all overflow-hidden border ${
                            isMyVote
                              ? 'border-terracotta dark:border-dark-terracotta'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="absolute inset-0 bg-terracotta-soft/20 dark:bg-dark-terracotta-soft/20" />
                          {totalVotes > 0 && (
                            <div
                              className="absolute inset-y-0 left-0 bg-terracotta/15 dark:bg-dark-terracotta/20 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="relative flex items-center justify-between p-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              {isMyVote && (
                                <Check className="w-4 h-4 text-terracotta dark:text-dark-terracotta flex-shrink-0" />
                              )}
                              <span className="text-sm text-deep-charcoal dark:text-dark-text truncate">
                                {option.text}
                              </span>
                              {isMyChoice && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-terracotta/10 dark:bg-dark-terracotta/20 text-terracotta dark:text-dark-terracotta flex-shrink-0">
                                  Your choice
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className="text-xs text-warm-grey dark:text-dark-text-secondary">
                                {votes}
                              </span>
                              <span className="text-sm font-medium text-terracotta dark:text-dark-terracotta min-w-[36px] text-right">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </button>

                        {isMyChoice && (
                          <button
                            onClick={() => handleDeleteChoice(pollId, optionId)}
                            className="absolute top-1/2 -translate-y-1/2 right-1 opacity-0 group-hover/opt:opacity-100 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-opacity"
                            title="Remove your choice"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {addingChoiceFor === pollId ? (
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      autoFocus
                      placeholder="New choice..."
                      value={newChoiceText}
                      onChange={(e) => setNewChoiceText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddChoiceSubmit(pollId);
                        if (e.key === 'Escape') {
                          setAddingChoiceFor(null);
                          setNewChoiceText('');
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-sm text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                    />
                    <button
                      onClick={() => handleAddChoiceSubmit(pollId)}
                      className="p-2 rounded-lg bg-terracotta text-white hover:bg-terracotta-hover transition-colors"
                      title="Add"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setAddingChoiceFor(null);
                        setNewChoiceText('');
                      }}
                      className="p-2 rounded-lg border border-[#e8eaed] dark:border-dark-border text-warm-grey hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingChoiceFor(pollId);
                      setNewChoiceText('');
                    }}
                    className="mt-3 text-xs text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add a choice
                  </button>
                )}

                {userVote && (
                  <p className="text-xs text-terracotta dark:text-dark-terracotta mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    You voted for "{userVote.optionText}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PollsTab;