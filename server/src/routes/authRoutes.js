import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  register,
  verify,
  login,
  logout,
  getMe,
  updateProfile,       // ← new
  deleteAccount,       // ← new
  requestAccountDeletion,
  resendVerification,
  changePassword,
  googleLogin,
  getGoogleAuthUrl,
  googleCallback,
} from '../controllers/authController.js';

const router = express.Router();

// ─── Public ───────────────────────────────────────────
router.post('/register', register);
router.post('/verify', verify);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-verification', resendVerification);

// ─── Google OAuth ─────────────────────────────────────
router.get('/google/url', getGoogleAuthUrl);
router.post('/google/login', googleLogin);
router.get('/google/callback', googleCallback);

// ─── Protected (require auth) ─────────────────────────
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);      
router.delete('/account', protect, deleteAccount);     
router.post('/change-password', protect, changePassword);
router.post('/account/request-delete', protect, requestAccountDeletion);
router.delete('/account', protect, deleteAccount);

export default router;