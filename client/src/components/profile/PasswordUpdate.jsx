import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { authService } from '../../services/authService';

const PasswordUpdate = ({ isGoogleUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white font-medium hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving && <Loader className="w-4 h-4 animate-spin" />}
        {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

export default PasswordUpdate;