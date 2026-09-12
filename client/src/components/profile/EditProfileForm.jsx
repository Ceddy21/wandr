import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { authService } from '../../services/authService';

const EditProfileForm = ({ user, onUserChange }) => {
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const dirty = name.trim() !== (user?.name || '').trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Name cannot be empty');
      return;
    }
    if (trimmed === user.name) {
      toast('Nothing to save', { icon: 'ℹ️' });
      return;
    }

    setSaving(true);
    try {
      const { user: updated } = await authService.updateProfile({
        name: trimmed,
        avatar: user.avatar,
      });

      onUserChange(updated);       // ← parent updates state + localStorage + event
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          Display Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all"
          placeholder="Your name"
        />
        <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
          This is how you'll appear to other trip members.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-off-white dark:bg-dark-bg text-warm-grey dark:text-dark-text-secondary cursor-not-allowed"
        />
        <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
          Email cannot be changed.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving || !dirty}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white font-medium hover:bg-terracotta-hover dark:hover:bg-[#c47050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving && <Loader className="w-4 h-4 animate-spin" />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditProfileForm;