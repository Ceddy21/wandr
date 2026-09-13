import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader, AlertTriangle, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';

const CONFIRM_PHRASE = 'DELETE';

const DeleteAccount = ({ isGoogleUser, onDeleted }) => {
  const [step, setStep] = useState('confirm'); 

  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');

  const [code, setCode] = useState('');

  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canSendCode =
    confirmText === CONFIRM_PHRASE &&
    (isGoogleUser || password.length > 0) &&
    !sending;

  const handleSendCode = async () => {
    if (!canSendCode) return;
    setSending(true);
    try {
      await authService.requestAccountDeletion(
        isGoogleUser ? undefined : password
      );
      toast.success('Verification code sent to your email');
      setStep('verify');
    } catch (err) {
      toast.error(err.message || 'Failed to send code');
    } finally {
      setSending(false);
    }
  };

  const canDelete = code.trim().length >= 4 && !deleting;

  const handleConfirmDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    try {
      await authService.deleteAccount(code.trim());
      toast.success('Account deleted');
      onDeleted?.();
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800 dark:text-red-300">
          <p className="font-medium">This action is permanent.</p>
          <p className="mt-1">
            Your account and all associated data will be deleted. This cannot
            be undone.
          </p>
        </div>
      </div>

      {step === 'confirm' && (
        <>
          {!isGoogleUser && (
            <div>
              <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Type <span className="font-mono font-bold">{CONFIRM_PHRASE}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          <button
            onClick={handleSendCode}
            disabled={!canSendCode}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {sending ? 'Sending code...' : 'Send verification code'}
          </button>
        </>
      )}

      {step === 'verify' && (
        <>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
            <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              We sent a 6-digit code to your email. Enter it below to
              confirm deletion.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="123456"
              maxLength={6}
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirmDelete}
              disabled={!canDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              {deleting ? 'Deleting...' : 'Confirm deletion'}
            </button>

            <button
              onClick={() => {
                setStep('confirm');
                setCode('');
              }}
              disabled={deleting}
              className="inline-flex items-center gap-1 px-3 py-2.5 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-deep-charcoal dark:hover:text-dark-text transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteAccount;