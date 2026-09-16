import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader, Eye, EyeOff, Check, X } from 'lucide-react';
import { authService } from '../../services/authService';

const PASSWORD_RULES = [
  { key: 'length',  label: 'At least 8 characters',  test: (p) => p.length >= 8 },
  { key: 'lower',   label: 'One lowercase letter',   test: (p) => /[a-z]/.test(p) },
  { key: 'upper',   label: 'One uppercase letter',   test: (p) => /[A-Z]/.test(p) },
  { key: 'number',  label: 'One number',             test: (p) => /\d/.test(p) },
  {
    key: 'special',
    label: 'One special character (!@#$%^&*_...)',
    test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(p),
  },
];

const PasswordUpdate = ({ isGoogleUser }) => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [touchedNew, setTouchedNew] = useState(false);

  const passwordChecks = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        ...rule,
        passed: rule.test(newPassword),
      })),
    [newPassword]
  );

  const allPassed = passwordChecks.every((c) => c.passed);

  if (isGoogleUser) {
    return (
      <div className="max-w-md">
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
          You signed up with Google, so password management is handled by your
          Google account.
        </p>
      </div>
    );
  }

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConfirmError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!allPassed) {
      setError('Please meet all password requirements.');
      setTouchedNew(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });

      toast.success('Password updated. Please log in again.', {
        duration: 2500,
      });

      localStorage.removeItem('user');

      setTimeout(() => {
        navigate('/login?reason=session_expired', { replace: true });
      }, 800);
    } catch (err) {
      const msg = err.message || 'Failed to change password';

      if (msg.toLowerCase().includes('current password')) {
        setError('Current password is incorrect.');
      } else {
        setError(msg);
      }
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (error) setError('');
            }}
            autoComplete="current-password"
            className={`w-full px-4 py-2.5 pr-12 rounded-lg border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                : 'border-[#e8eaed] dark:border-dark-border focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-warm-grey dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] transition-colors"
            aria-label={showCurrent ? 'Hide password' : 'Show password'}
          >
            {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (error) setError('');
              if (confirmError) setConfirmError('');
            }}
            onFocus={() => setTouchedNew(true)}
            autoComplete="new-password"
            className={`w-full px-4 py-2.5 pr-12 rounded-lg border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                : 'border-[#e8eaed] dark:border-dark-border focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-warm-grey dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] transition-colors"
            aria-label={showNew ? 'Hide password' : 'Show password'}
          >
            {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Progressive password rules */}
        {touchedNew && newPassword.length > 0 && (
          <ul className="mt-2.5 space-y-1.5">
            {passwordChecks.map((check) => (
              <li
                key={check.key}
                className="flex items-center gap-1.5 text-xs"
                style={{
                  color: check.passed ? '#16a34a' : undefined,
                }}
              >
                {check.passed ? (
                  <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-warm-grey dark:text-dark-text-secondary flex-shrink-0 opacity-60" />
                )}
                <span
                  className={
                    check.passed
                      ? 'text-green-600'
                      : 'text-warm-grey dark:text-dark-text-secondary'
                  }
                >
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmError) setConfirmError('');
            }}
            autoComplete="new-password"
            className={`w-full px-4 py-2.5 pr-12 rounded-lg border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 transition-all ${
              mismatch || confirmError
                ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                : 'border-[#e8eaed] dark:border-dark-border focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-warm-grey dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {(mismatch || confirmError) && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">
            {confirmError || 'New passwords do not match.'}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving || !allPassed || mismatch}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white font-medium hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving && <Loader className="w-4 h-4 animate-spin" />}
        {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

export default PasswordUpdate;