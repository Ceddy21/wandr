import React, { useRef, useEffect, useState } from 'react';
import {
  Send,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  Pencil,
  Forward,
  Reply,
  X,
  Loader,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../../utils/CloudinaryUploads';

const CHAT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const CHAT_IMAGE_ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];
const CHAT_IMAGE_ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const validateChatImage = (file) => {
  if (!file) return 'No file selected';

  if (file.size > CHAT_IMAGE_MAX_SIZE) {
    return 'Image too large. Maximum size is 5 MB.';
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!CHAT_IMAGE_ALLOWED_EXTENSIONS.includes(ext)) {
    return 'Invalid file extension. Use JPG, PNG, WEBP, or GIF.';
  }

  if (file.type && !CHAT_IMAGE_ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid image type. Use JPG, PNG, WEBP, or GIF.';
  }

  return null;
};

const getReplyPreviewText = (msg) => {
  if (!msg) return '';
  if (msg.deleted) return 'This message was deleted';
  if (msg.text && msg.text.trim()) return msg.text;
  if (msg.imageUrl) return '📷 Image';
  return '';
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const SeenBadge = ({ user }) => {
  if (!user) return null;
  const hasAvatar = user.avatar && typeof user.avatar === 'string';

  return (
    <div
      className="w-4 h-4 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center text-[7px] font-medium text-deep-charcoal dark:text-dark-text border border-white dark:border-dark-card overflow-hidden flex-shrink-0"
      title={`Seen by ${user.name || 'member'}`}
    >
      {hasAvatar ? (
        <img
          src={user.avatar}
          alt={user.name || 'User'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(user.name)}</span>
      )}
    </div>
  );
};

function ChatTab({
  currentUserId,
  messages = [],
  newMessage,
  setNewMessage,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onMarkRead,
}) {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      onMarkRead &&
      messages.some(
        (m) =>
          m.userId?.toString() !== currentUserId?.toString() &&
          m.status !== 'read'
      )
    ) {
      onMarkRead();
    }
  }, [messages.length]);

  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [openMenuId]);

  const isMessageOwn = (message) => {
    if (!currentUserId || !message.userId) return false;
    return message.userId.toString() === currentUserId.toString();
  };

  const getSeenBy = (message) => {
    if (!Array.isArray(message.readBy)) return [];
    const senderId = message.userId?.toString();
    return message.readBy.filter((u) => {
      const uid = (u._id || u).toString();
      return uid !== senderId;
    });
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 30) return 'Just now';
    if (diffMin < 1) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const replyId = replyingTo?._id || null;
    onSendMessage(undefined, replyId);
    setReplyingTo(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateChatImage(file);
    if (validationError) {
      toast.error(validationError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'wanderly/chat');
      const replyId = replyingTo?._id || null;
      await onSendMessage(url, replyId);
      toast.success('Image sent!');
      setReplyingTo(null);
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || !editingMessage) return;
    const result = await onEditMessage(editingMessage._id, editText.trim());
    if (result?.success) {
      setEditingMessage(null);
      setEditText('');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    await onDeleteMessage(deletingMessage._id);
    setDeletingMessage(null);
  };

  const handleForward = (msg) => {
    const content = msg.text || msg.imageUrl || '';
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
    setOpenMenuId(null);
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
    setOpenMenuId(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const getUserInitials = (name) => getInitials(name);

  return (
    <div className="flex flex-col h-[500px]">
      <div className="scrollbar-fade flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = isMessageOwn(message);
            const isDeleted = message.deleted;
            const replyTarget = message.replyTo;
            const seenBy = getSeenBy(message);

            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
              >
                <div className="relative max-w-[75%]">
                  <div
                    className={`p-3 rounded-lg shadow-sm ${
                      isOwn
                        ? 'bg-terracotta text-white dark:bg-dark-terracotta border-2 border-terracotta-hover dark:border-[#c47050]'
                        : 'bg-[#f0f2f5] text-deep-charcoal dark:bg-dark-card/50 dark:text-dark-text border-2 border-[#d5dae0] dark:border-dark-border'
                    }`}
                  >
                    {!isOwn && !isDeleted && (
                      <p className="text-xs font-semibold text-terracotta dark:text-dark-terracotta mb-1">
                        {message.user}
                      </p>
                    )}

                    {isDeleted ? (
                      <p className="text-sm italic opacity-60">
                        This message was deleted
                      </p>
                    ) : (
                      <>
                        {replyTarget && (
                          <div
                            className={`mb-2 px-2.5 py-1.5 rounded border-l-2 text-xs ${
                              isOwn
                                ? 'bg-white/15 border-white/60 text-white/90'
                                : 'bg-terracotta-soft/60 dark:bg-dark-terracotta-soft/60 border-terracotta dark:border-dark-terracotta text-deep-charcoal dark:text-dark-text'
                            }`}
                          >
                            <p
                              className={`font-semibold mb-0.5 ${
                                isOwn ? 'text-white' : 'text-terracotta dark:text-dark-terracotta'
                              }`}
                            >
                              {replyTarget.user || 'Unknown'}
                            </p>
                            <p className="truncate opacity-90">
                              {getReplyPreviewText(replyTarget)}
                            </p>
                          </div>
                        )}

                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="Chat"
                            className="max-w-[200px] rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(message.imageUrl)}
                          />
                        )}

                        {message.text && (
                          <p className="text-sm break-words whitespace-pre-wrap">
                            {message.text}
                            {message.edited && (
                              <span className="text-xs italic opacity-70 ml-1">
                                (edited)
                              </span>
                            )}
                          </p>
                        )}
                      </>
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                        isOwn
                          ? 'text-white/70'
                          : 'text-warm-grey dark:text-dark-text-secondary'
                      }`}
                    >
                      <span>{formatMessageTime(message.createdAt)}</span>

                      {isOwn && !isDeleted && (
                        <span
                          className={
                            message.status === 'read'
                              ? 'text-blue-300 dark:text-blue-400 font-bold'
                              : 'opacity-70'
                          }
                        >
                          {message.status === 'read' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isOwn && !isDeleted && (
                    <div className="flex items-center gap-1.5 mt-1 ml-1">
                      <div className="w-4 h-4 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center text-[8px] font-medium text-deep-charcoal dark:text-dark-text">
                        {getUserInitials(message.user)}
                      </div>
                      <span className="text-[10px] text-warm-grey dark:text-dark-text-secondary">
                        {message.user}
                      </span>
                    </div>
                  )}

                  {!isDeleted && seenBy.length > 0 && (
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isOwn ? 'justify-end mr-1' : 'justify-start ml-1'
                      }`}
                    >
                      <span className="text-[9px] text-warm-grey dark:text-dark-text-secondary mr-0.5">
                        Seen by
                      </span>
                      <div className="flex -space-x-1.5">
                        {seenBy.slice(0, 3).map((user) => (
                          <SeenBadge key={user._id || user} user={user} />
                        ))}
                        {seenBy.length > 3 && (
                          <div className="w-4 h-4 rounded-full bg-[#e8eaed] dark:bg-dark-border flex items-center justify-center text-[7px] font-medium text-warm-grey dark:text-dark-text-secondary border border-white dark:border-dark-card">
                            +{seenBy.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!isDeleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === message._id ? null : message._id
                        );
                      }}
                      className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft ${
                        isOwn ? '-left-8' : '-right-8'
                      }`}
                    >
                      <MoreVertical className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                    </button>
                  )}

                  {openMenuId === message._id && (
                    <div
                      className={`absolute top-10 z-20 bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-lg shadow-lg overflow-hidden min-w-[130px] ${
                        isOwn ? 'left-0' : 'right-0'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleReply(message)}
                        className="w-full px-3 py-2 text-left text-sm text-deep-charcoal dark:text-dark-text hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft flex items-center gap-2"
                      >
                        <Reply className="w-3.5 h-3.5" /> Reply
                      </button>

                      {isOwn && (
                        <>
                          <button
                            onClick={() => {
                              setEditingMessage(message);
                              setEditText(message.text || '');
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-deep-charcoal dark:text-dark-text hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft flex items-center gap-2"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleForward(message)}
                            className="w-full px-3 py-2 text-left text-sm text-deep-charcoal dark:text-dark-text hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft flex items-center gap-2"
                          >
                            <Forward className="w-3.5 h-3.5" /> Forward
                          </button>
                          <button
                            onClick={() => {
                              setDeletingMessage(message);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="flex items-start gap-3 mb-3 px-3 py-2 bg-terracotta-soft/60 dark:bg-dark-terracotta-soft/60 border-l-4 border-terracotta dark:border-dark-terracotta rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-terracotta dark:text-dark-terracotta mb-0.5">
              Replying to {replyingTo.user || 'member'}
            </p>
            <p className="text-xs text-deep-charcoal dark:text-dark-text truncate opacity-80">
              {getReplyPreviewText(replyingTo)}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 rounded-full hover:bg-white/40 dark:hover:bg-dark-card/40 transition-colors flex-shrink-0"
            aria-label="Cancel reply"
          >
            <X className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-[#e8eaed] dark:border-dark-border pt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2.5 rounded-lg text-warm-grey dark:text-dark-text-secondary hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors disabled:opacity-50"
          title="Upload image"
        >
          {uploading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          className="hidden"
        />

        <input
          ref={inputRef}
          type="text"
          placeholder={replyingTo ? 'Type your reply...' : 'Type a message...'}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        />

        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || uploading}
          className="p-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl">
            <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text mb-4">
              Edit Message
            </h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingMessage(null)}
                className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl">
            <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text mb-2">
              Delete Message?
            </h3>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-4">
              This will show as "deleted" for everyone. Cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingMessage(null)}
                className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ChatTab;