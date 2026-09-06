import React from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';

function ChatTab({ trip, newMessage, setNewMessage, onSendMessage }) {
  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Chat</h3>
        <span className="text-xs text-warm-grey dark:text-dark-text-secondary">{trip.members.length} members</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {trip.messages.map(message => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-lg p-3 ${message.isOwn ? 'bg-terracotta text-white' : 'bg-terracotta-soft dark:bg-dark-terracotta-soft text-deep-charcoal dark:text-dark-text'}`}>
              <p className="text-sm">{message.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block">{message.user} • {message.time}</span>
            </div>
          </div>
        ))}
        {trip.messages.length === 0 && (
          <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No messages yet.</p>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-[#e8eaed] dark:border-dark-border pt-3">
        <label className="cursor-pointer p-2 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors">
          <ImageIcon className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          <input type="file" accept="image/*,video/*" className="hidden" />
        </label>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <button
          onClick={onSendMessage}
          className="p-2 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
        Max 10MB per file. Supports: JPG, PNG, GIF, WebP, MP4, WebM
      </p>
    </div>
  );
}

export default ChatTab;