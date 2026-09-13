import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Loader, Share2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ShareTripModal = ({ isOpen, onClose, trip }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !trip?._id) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setCopied(false);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/trips/${trip._id}/share-code`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to get share code');
        if (!cancelled) setCode(data.shareCode);
      } catch (err) {
        toast.error(err.message || 'Failed to load share code');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, trip?._id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = async () => {
    const shareText = `Join my trip "${trip.name}" on Wandr! Use code: ${code}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my trip on Wandr',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Invite message copied!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed] dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
            <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
              Share this trip
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-4">
            Anyone with this code can join <strong className="text-deep-charcoal dark:text-dark-text">"{trip.name}"</strong>.
          </p>

          <div className="relative">
            <div className="bg-gradient-to-br from-[#2D6A4F]/5 to-[#E76F51]/5 dark:from-[#2D6A4F]/10 dark:to-[#E76F51]/10 border-2 border-dashed border-[#2D6A4F]/30 dark:border-[#E76F51]/30 rounded-xl p-6 text-center">
              {loading ? (
                <Loader className="w-6 h-6 animate-spin text-terracotta mx-auto" />
              ) : (
                <div className="font-mono text-4xl font-bold tracking-[0.3em] text-deep-charcoal dark:text-dark-text select-all">
                  {code}
                </div>
              )}
              <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-3">
                {loading ? 'Generating...' : 'Share this code with your friends'}
              </p>
            </div>

            {!loading && (
              <button
                onClick={handleCopy}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2D6A4F] dark:bg-[#E76F51] text-white font-medium hover:opacity-90 transition-opacity"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy code
                  </>
                )}
              </button>
            )}

            {!loading && (
              <button
                onClick={handleShare}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share invite message
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTripModal;