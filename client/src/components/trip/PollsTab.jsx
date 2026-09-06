import React from 'react';
import { Plus } from 'lucide-react';

function PollsTab({ trip, onCreatePoll }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Polls</h3>
        <button
          onClick={onCreatePoll}
          className="flex items-center gap-2 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Poll
        </button>
      </div>
      <div className="space-y-4">
        {trip.polls.map(poll => (
          <div key={poll.id} className="p-4 border border-[#e8eaed] dark:border-dark-border rounded-lg">
            <p className="font-medium text-deep-charcoal dark:text-dark-text">{poll.question}</p>
            <p className="text-xs text-warm-grey dark:text-dark-text-secondary mb-3">Created by {poll.createdBy}</p>
            <div className="space-y-2">
              {poll.options.map(option => (
                <div key={option} className="flex items-center gap-3 p-2 bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 rounded-lg cursor-pointer hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors">
                  <span className="text-sm text-deep-charcoal dark:text-dark-text flex-1">{option}</span>
                  <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{poll.votes[option] || 0} votes</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {trip.polls.length === 0 && (
          <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No polls created yet.</p>
        )}
      </div>
    </div>
  );
}

export default PollsTab;