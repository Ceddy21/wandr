import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

function ChatTab({ trip, newMessage, setNewMessage, onSendMessage }) {
  const messagesEndRef = useRef(null);

  const messages = trip?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id || message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.isOwn
                    ? 'bg-terracotta text-white dark:bg-dark-terracotta'
                    : 'bg-[#f0f2f5] text-deep-charcoal dark:bg-dark-card/50 dark:text-dark-text'
                }`}
              >
                {!message.isOwn && (
                  <p className="text-xs font-medium text-terracotta dark:text-dark-terracotta mb-1">
                    {message.user}
                  </p>
                )}
                <p className="text-sm break-words">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-warm-grey dark:text-dark-text-secondary'}`}>
                  {message.time || 'Just now'}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-[#e8eaed] dark:border-dark-border pt-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
        />
        <button
          onClick={onSendMessage}
          disabled={!newMessage.trim()}
          className="p-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatTab;