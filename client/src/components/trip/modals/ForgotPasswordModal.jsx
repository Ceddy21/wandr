import React, { useState, useMemo } from 'react';
import {
  X,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../../services/authService';

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

const STRENGTH_LEVELS = [
  { label: 'Very weak', color: '#dc2626', bg: '#dc2626' },
  { label: 'Weak',      color: '#f97316', bg: '#f97316' },
  { label: 'Fair',      color: '#eab308', bg: '#eab308' },
  { label: 'Good',      color: '#84cc16', bg: '#84cc16' },
  { label: 'Strong',    color: '#16a34a', bg: '#16a34a' },
];

export const ForgotPasswordModal = ({ isOpen, onClose, theme }) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [error, setError] = useState('');

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(newPassword) })),
    [newPassword]
  );
  const passedCount = passwordChecks.filter((c) => c.passed).length;
  const allPassed = passedCount === PASSWORD_RULES.length;

  const strengthIndex = useMemo(() => {
    if (!newPassword) return -1;
    if (passedCount <= 1) return 0;
    if (passedCount === 2) return 1;
    if (passedCount === 3) return 2;
    if (passedCount === 4) return 3;
    return 4;
  }, [passedCount, newPassword]);

  const strength = strengthIndex >= 0 ? STRENGTH_LEVELS[strengthIndex] : null;
  const confirmMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const isDark = theme === 'dark';

  const handleClose = () => {
    if (loading) return;
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setTouchedPassword(false);
    setShowPassword(false);
    setShowConfirm(false);
    setError('');
    onClose();
  };

  const handleSendCode = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      toast.success('Check your email for the reset code');
      setStep('code');
    } catch (err) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    if (code.length !== 6) {
      setError('Code must be 6 digits.');
      return;
    }
    setLoading(true);
    try {
      await authService.verifyResetCode(email.trim(), code);
      toast.success('Code verified');
      setStep('password');
    } catch (err) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (!allPassed) {
      setError('Please meet all password requirements.');
      setTouchedPassword(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim(),
        code,
        newPassword,
      });
      toast.success('Password reset! You can now log in.');
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl relative overflow-hidden"
        style={{
          background: isDark ? 'rgba(30, 30, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          boxShadow: isDark
            ? '0 25px 60px -15px rgba(0,0,0,0.6)'
            : '0 25px 60px -15px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, #2D6A4F, #c46a4d, #E76F51)',
            boxShadow: '0 1px 8px rgba(196,106,77,0.3)',
          }}
        />

        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-terracotta/10 dark:bg-dark-terracotta/10 text-terracotta dark:text-dark-terracotta">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
              Reset password
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 pb-4">
          {['email', 'code', 'password'].map((s, i) => {
            const stepIndex = ['email', 'code', 'password'].indexOf(step);
            const active = i <= stepIndex;
            return (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: active
                    ? '#E76F51'
                    : isDark
                    ? 'rgba(255,255,255,0.1)'
                    : '#E5E7EB',
                }}
              />
            );
          })}
        </div>

        <div className="px-6 pb-6 space-y-4">

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 leading-snug">
                {error}
              </p>
            </div>
          )}

          {step === 'email' && (
            <>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
                Enter the email associated with your Wandr account. We'll send you a code to reset your password.
              </p>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSendCode}
                disabled={loading || !email.trim()}
                className="w-full py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading ? 'Sending...' : 'Send reset code'}
              </button>
            </>
          )}

          {step === 'code' && (
            <>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
                We sent a 6-digit code to{' '}
                <strong className="text-deep-charcoal dark:text-dark-text">{email}</strong>.
                Enter it below.
              </p>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Verification code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (error) setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                    placeholder="123456"
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text text-center font-mono text-lg tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1.5">
                  {code.length}/6 digits
                </p>
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {loading ? 'Verifying...' : 'Verify code'}
              </button>

              <button
                onClick={() => {
                  setStep('email');
                  setError('');
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1 py-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Use a different email
              </button>
            </>
          )}

          {step === 'password' && (
            <>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary">
                Choose a new password for your account.
              </p>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    onFocus={() => setTouchedPassword(true)}
                    placeholder="••••••••"
                    autoFocus
                    className="w-full px-4 py-2.5 pl-10 pr-12 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-warm-grey dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] transition-all"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {touchedPassword && newPassword.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-warm-grey dark:text-dark-text-secondary">
                          Password strength
                        </span>
                        <span
                          className="font-medium transition-colors"
                          style={{ color: strength?.color || '#9CA3AF' }}
                        >
                          {strength?.label || '—'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                strengthIndex >= i
                                  ? strength?.bg
                                  : isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : '#E5E7EB',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                      {passwordChecks.map((check) => (
                        <li
                          key={check.key}
                          className="flex items-center gap-1.5 text-xs transition-colors"
                          style={{
                            color: check.passed
                              ? '#16a34a'
                              : isDark
                              ? '#9CA3AF'
                              : '#6B7280',
                          }}
                        >
                          {check.passed ? (
                            <Check className="w-3.5 h-3.5 flex-shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                          )}
                          <span>{check.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 pl-10 pr-12 rounded-lg border bg-white/80 dark:bg-dark-card/80 text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      confirmMismatch
                        ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                        : 'border-[#e8eaed] dark:border-dark-border focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-warm-grey dark:text-dark-text-secondary hover:text-[#2D6A4F] dark:hover:text-[#E76F51] transition-all"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmMismatch && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading || !allPassed || confirmMismatch}
                className="w-full py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;