import React from 'react';
import { X } from 'lucide-react';

export const CreatePollModal = ({
  isOpen,
  onClose,
  trip,
  newPoll,
  setNewPoll,
  addOption,
  updateOption,
  removeOption,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>
        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Create Poll</h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Create a poll for your trip members.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Question</label>
            <input
              type="text"
              placeholder="What would you like to ask?"
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Options</label>
            {newPoll.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
            <button onClick={addOption} className="text-sm text-terracotta dark:text-dark-terracotta hover:underline">
              + Add Option
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Created By</label>
            <select
              value={newPoll.createdBy}
              onChange={(e) => setNewPoll({ ...newPoll, createdBy: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
            >
              {trip.members?.map((member) => (
                <option key={member._id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
            >
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};