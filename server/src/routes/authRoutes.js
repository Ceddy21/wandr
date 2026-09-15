import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.js';
import {
  register,
  verify,
  login,
  logout,
  getMe,
  getSessions,
  revokeSession,
  updateProfile,
  deleteAccount,
  requestAccountDeletion,
  resendVerification,
  changePassword,
  googleLogin,
  getGoogleAuthUrl,
  googleCallback,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many accounts created from this IP. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many verification attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many reset requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Too many resend requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const googleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many Google login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerLimiter, register);
router.post('/verify', verifyLimiter, verify);
router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);
router.post('/resend-verification', resendLimiter, resendVerification);

router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/verify-reset-code', verifyLimiter, verifyResetCode);
router.post('/reset-password', verifyLimiter, resetPassword);

router.get('/socket-token', protect, (req, res) => {
  res.json({ token: req.cookies.wandr_token });
});

router.get('/google/url', googleLimiter, getGoogleAuthUrl);
router.post('/google/login', googleLimiter, googleLogin);
router.get('/google/callback', googleCallback);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

router.get('/sessions', protect, getSessions);
router.delete('/sessions/:sessionId', protect, revokeSession);

router.post('/account/request-delete', protect, requestAccountDeletion);
router.delete('/account', protect, deleteAccount);

export default router;