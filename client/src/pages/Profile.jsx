import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Key, 
  Trash2, 
  Camera,
  Loader,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// ---- Import tab components ----
import EditProfileForm from '../components/profile/EditProfileForm';
import PasswordUpdate from '../components/profile/PasswordUpdate';
import DeleteAccount from '../components/profile/DeleteAccount';

function ProfilePage() {
  const [user, setUser] = useState({
    name: 'Bhrenda Mae',
    email: 'bhrenda@email.com',
    avatar: null
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // ---- Mock user data (replace with real API later) ----
  useEffect(() => {
    // TODO: Fetch user data from API
    // const response = await fetch('/api/users/me');
    // const data = await response.json();
    // setUser(data);
  }, []);

  const handleAvatarUpload = async (file) => {
    setLoading(true);
    try {
      // --- REPLACE WITH REAL CLOUDINARY UPLOAD ---
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      // const response = await fetch(
      //   `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      //   { method: 'POST', body: formData }
      // );
      // const data = await response.json();
      // setUser({ ...user, avatar: data.secure_url });

      // --- MOCK UPLOAD ---
      const mockAvatar = 'https://res.cloudinary.com/sqlrnnth/image/upload/v1788704496/bhrendamae.jpg';
      setUser({ ...user, avatar: mockAvatar });
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">

      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
          Profile Settings
        </h1>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl overflow-hidden shadow-sm">

        <div className="p-6 sm:p-8 border-b border-[#e8eaed] dark:border-dark-border">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center overflow-hidden border-4 border-terracotta-soft dark:border-dark-terracotta-soft">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-terracotta dark:text-dark-terracotta" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors cursor-pointer">
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleAvatarUpload(file);
                  }}
                  disabled={loading}
                />
              </label>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-deep-charcoal dark:text-dark-text">
                {user.name}
              </h2>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
                Member since April 2025
              </p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-[#e8eaed] dark:border-dark-border px-6">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'password', label: 'Password', icon: Key },
            { id: 'danger', label: 'Delete Account', icon: Trash2 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-terracotta text-terracotta dark:border-dark-terracotta dark:text-dark-terracotta'
                    : 'border-transparent text-warm-grey dark:text-dark-text-secondary hover:text-deep-charcoal dark:hover:text-dark-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'profile' && (
            <EditProfileForm user={user} setUser={setUser} />
          )}

          {activeTab === 'password' && (
            <PasswordUpdate />
          )}

          {activeTab === 'danger' && (
            <DeleteAccount />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;