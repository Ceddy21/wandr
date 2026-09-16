import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Key,
  Trash2,
  Camera,
  Loader,
} from 'lucide-react';
import { authService } from '../services/authService';
import { syncUser } from '../utils/authEvent';
import EditProfileForm from '../components/profile/EditProfileForm';
import PasswordUpdate from '../components/profile/PasswordUpdate';
import DeleteAccount from '../components/profile/DeleteAccount';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { user: u } = await authService.getMe();
        if (cancelled) return;
        setUser(u);
        syncUser(u);
      } catch (err) {
        toast.error(err.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleUserChange = (updatedUser) => {
    setUser(updatedUser);
    syncUser(updatedUser);
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > MAX_SIZE) {
      toast.error('File too large. Maximum size is 2 MB.');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Use JPG, PNG, or WEBP.');
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        import.meta.env.VITE_CLOUDINARY_PROFILE_PRESET
      );

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (!cloudRes.ok) throw new Error('Cloudinary upload failed');
      const cloudData = await cloudRes.json();

      const { user: updated } = await authService.updateProfile({
        name: user.name,
        avatar: cloudData.secure_url,
      });

      handleUserChange(updated);
      toast.success('Avatar updated!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <Loader className="w-8 h-8 animate-spin text-terracotta dark:text-dark-terracotta" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Failed to load profile</p>
          <Link to="/dashboard" className="text-terracotta hover:underline mt-4 block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      {/* Header: Title left, Back link right */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
            Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <Link
          to="/dashboard"
          className="text-xs sm:text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap pt-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl overflow-hidden shadow-sm">
        {/* Avatar + user info row */}
        <div className="p-5 sm:p-8 border-b border-[#e8eaed] dark:border-dark-border">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center overflow-hidden border-4 border-terracotta-soft dark:border-dark-terracotta-soft">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-12 sm:h-12 text-terracotta dark:text-dark-terracotta" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1 sm:p-1.5 rounded-full bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors cursor-pointer border-2 border-white dark:border-dark-card">
                {uploadingAvatar ? (
                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                    e.target.value = '';
                  }}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-xl font-semibold text-deep-charcoal dark:text-dark-text truncate">
                {user.name || 'Unnamed User'}
              </h2>
              <p className="text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-1 mt-0.5 truncate">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              {memberSince && (
                <p className="text-[11px] sm:text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
                  Member since {memberSince}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e8eaed] dark:border-dark-border px-2 sm:px-6 overflow-x-auto">
          {[
            { id: 'profile',  label: 'Profile',        icon: User },
            { id: 'password', label: 'Password',       icon: Key },
            { id: 'danger',   label: 'Delete Account', icon: Trash2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-terracotta text-terracotta dark:border-dark-terracotta dark:text-dark-terracotta'
                    : 'border-transparent text-warm-grey dark:text-dark-text-secondary hover:text-deep-charcoal dark:hover:text-dark-text'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'profile' && (
            <EditProfileForm user={user} onUserChange={handleUserChange} />
          )}
          {activeTab === 'password' && (
            <PasswordUpdate isGoogleUser={user.isGoogleUser} />
          )}
          {activeTab === 'danger' && (
            <DeleteAccount
              isGoogleUser={user.isGoogleUser}
              onDeleted={() => {
                syncUser(null);
                navigate('/login');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;