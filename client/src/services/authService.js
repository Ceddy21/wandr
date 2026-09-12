const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
  // ─── GET /api/auth/me ──────────────────────────────────
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to load profile');
    }
    return res.json();          // { user }
  },

  // ─── PUT /api/auth/profile ─────────────────────────────
  updateProfile: async ({ name, avatar }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, avatar }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }
    return res.json();          // { message, user }
  },

  // ─── POST /api/auth/change-password ────────────────────
  changePassword: async ({ currentPassword, newPassword }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to change password');
    }
    return res.json();
  },

  // ─── POST /api/auth/account/request-delete ─────────────
  // Step 1: verify password, email a one-time code
  requestAccountDeletion: async (password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/account/request-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send code');
    }
    return res.json();
  },

  // ─── DELETE /api/auth/account ──────────────────────────
  // Step 2: verify code, cascade delete everything
  deleteAccount: async (code) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/account`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete account');
    }
    return res.json();
  },

  // ─── POST /api/auth/logout ─────────────────────────────
  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to log out');
    return res.json();
  },
};