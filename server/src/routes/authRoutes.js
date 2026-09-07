import express from 'express';
import { register, verify, login, logout, getMe, resendVerification, changePassword, googleLogin, getGoogleAuthUrl, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../utils/authLimiter.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/verify', authLimiter, verify);
router.post('/login', authLimiter, login);
router.post('/logout', authLimiter, logout);
router.post('/resend-verification', authLimiter, resendVerification);

router.get('/google/url', getGoogleAuthUrl);
router.post('/google/login', googleLogin);
router.get('/google/callback', googleCallback);

router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;