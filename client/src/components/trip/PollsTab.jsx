import React, { useState } from 'react';
import { Plus, BarChart, Users } from 'lucide-react';
import toast from 'react-hot-toast';

function PollsTab({ trip, onCreatePoll }) {
  const [votedPolls, setVotedPolls] = useState([]);

  const polls = trip?.polls || [];

  const handleVote = (pollId, option) => {
    toast.success(`Voted for "${option}"!`);
    setVotedPolls([...votedPolls, pollId]);
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Polls</h3>
        <button
          onClick={onCreatePoll}
          className="flex items-center gap-1 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
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
            const totalVotes = Object.values(poll.votes || {}).reduce((sum, v) => sum + v, 0);
            const hasVoted = votedPolls.includes(poll._id || poll.id);

            return (
              <div key={poll._id || poll.id} className="border border-[#e8eaed] dark:border-dark-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-deep-charcoal dark:text-dark-text">{poll.question}</h4>
                    <p className="text-xs text-warm-grey dark:text-dark-text-secondary flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      {totalVotes} votes • Created by {poll.createdBy}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {poll.options?.map((option) => {
                    const votes = poll.votes?.[option] || 0;
                    const percentage = calculatePercentage(votes, totalVotes);

                    return (
                      <button
                        key={option}
                        onClick={() => !hasVoted && handleVote(poll._id || poll.id, option)}
                        disabled={hasVoted}
                        className="w-full text-left relative"
                      >
                        <div className="flex items-center justify-between p-2 bg-terracotta-soft/20 dark:bg-dark-terracotta-soft/20 rounded-lg hover:bg-terracotta-soft/30 dark:hover:bg-dark-terracotta-soft/30 transition-colors disabled:opacity-70">
                          <span className="text-sm text-deep-charcoal dark:text-dark-text">{option}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-warm-grey dark:text-dark-text-secondary">{votes} votes</span>
                            <span className="text-sm font-medium text-terracotta dark:text-dark-terracotta">{percentage}%</span>
                          </div>
                        </div>
                        {hasVoted && (
                          <div
                            className="absolute inset-0 bg-terracotta/10 dark:bg-dark-terracotta/10 rounded-lg"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasVoted && (
                  <p className="text-xs text-terracotta dark:text-dark-terracotta mt-2">✓ You voted on this poll</p>
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