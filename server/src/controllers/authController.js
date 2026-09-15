import User from '../models/User.js';
import Session from '../models/Session.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { generateVerificationCode } from '../utils/generateCode.js';
import {
  sendVerificationEmail,
  sendAccountDeletionEmail,
  sendPasswordResetEmail,
} from '../utils/sendEmail.js';
import {
  registerSchema,
  loginSchema,
  verifySchema,
  changePasswordSchema,
  resetPasswordSchema,
} from '../utils/validator.js';
import dotenv from "dotenv";

import Trip from '../models/Trip.js';
import Message from '../models/Message.js';
import Expense from '../models/Expense.js';
import Itinerary from '../models/Itinerary.js';
import Poll from '../models/Polls.js';
import Activity from '../models/Activity.js';

dotenv.config({ path: './.env' });

const createGoogleClient = () => new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  `${process.env.CLIENT_URL || 'http://localhost:5173'}/google-callback`
);

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const recordSession = async (userId, tokenVersion, req) => {
  try {
    await Session.create({
      userId,
      tokenVersion,
      ip: req.ip || '',
      userAgent: req.headers['user-agent']?.slice(0, 200) || '',
      lastActive: new Date(),
    });
  } catch (err) {
    console.error('Session log error:', err.message);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const displayName = (name && name.trim()) || email.split('@')[0];

    const user = new User({
      email,
      name: displayName,
      passwordHash,
      verificationCode: hashCode(code),
      verificationCodeExpires: codeExpires,
      isVerified: false,
    });
    await user.save();

    await sendVerificationEmail(email, code);

    res.status(201).json({
      message: 'Account created! Check your email for the verification code.',
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.issues?.[0]?.message || error.errors?.[0]?.message || 'Validation error' });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, code } = verifySchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }

    if (user.verificationCode !== hashCode(code)) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    if (!user.name || !user.name.trim()) {
      user.name = user.email.split('@')[0];
    }

    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.issues?.[0]?.message || error.errors?.[0]?.message || 'Validation error' });
    }
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000
      );
      return res.status(423).json({
        message: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 10) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedLoginAttempts = 0;
        await user.save();

        return res.status(423).json({
          message: 'Too many failed attempts. Account locked for 15 minutes.',
        });
      }

      await user.save();
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    let needsSave = false;

    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      needsSave = true;
    }
    if (user.lockedUntil) {
      user.lockedUntil = null;
      needsSave = true;
    }
    if (!user.name || !user.name.trim()) {
      user.name = user.email.split('@')[0];
      needsSave = true;
    }

    if (needsSave) await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        tokenVersion: user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('wandr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    await recordSession(user._id, user.tokenVersion || 0, req);

    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.issues?.[0]?.message || error.errors?.[0]?.message || 'Validation error' });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const logout = async (req, res) => {
  try {
    await Session.findOneAndUpdate(
      { userId: req.userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
      { sort: { createdAt: -1 } }
    );
  } catch (err) {
    console.error('Logout session update error:', err.message);
  }

  res.clearCookie('wandr_token');
  res.json({ message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      '-passwordHash -verificationCode -verificationCodeExpires -deleteAccountCode -deleteAccountCodeExpires -resetCode -resetCodeExpires'
    );
    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.userId,
      revokedAt: null,
    })
      .sort({ lastActive: -1 })
      .limit(20)
      .lean();

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch sessions.' });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.userId,
      revokedAt: null,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    session.revokedAt = new Date();
    await session.save();

    res.json({ message: 'Session revoked.' });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ message: 'Failed to revoke session.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return res.status(400).json({ message: 'Name cannot be empty.' });
      }
      if (trimmed.length > 80) {
        return res.status(400).json({ message: 'Name is too long.' });
      }
      user.name = trimmed;
    }

    if (avatar !== undefined) {
      user.avatar = avatar || null;
    }

    await user.save();

    res.json({
      message: 'Profile updated.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isGoogleUser: user.isGoogleUser,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    const GENERIC_RESPONSE = {
      message: 'If an account with that email exists, a password reset code has been sent.',
    };

    if (!user) {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    if (user.isGoogleUser) {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    if (
      user.resetCodeExpires &&
      user.resetCodeExpires > new Date(Date.now() + 9 * 60 * 1000)
    ) {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = hashCode(code);
    user.resetCodeExpires = codeExpires;
    await user.save();

    await sendPasswordResetEmail(user.email, code);

    res.status(200).json(GENERIC_RESPONSE);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid code.' });
    }

    if (!user.resetCode || user.resetCode !== hashCode(code)) {
      return res.status(400).json({ message: 'Invalid code.' });
    }

    if (!user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired. Request a new one.' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = resetPasswordSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid request.' });
    }

    if (!user.resetCode || user.resetCode !== hashCode(code)) {
      return res.status(400).json({ message: 'Invalid code.' });
    }

    if (!user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired. Request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetCode = null;
    user.resetCodeExpires = null;

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    await Session.updateMany(
      { userId: user._id, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.issues?.[0]?.message || error.errors?.[0]?.message || 'Validation error' });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const requestAccountDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.isGoogleUser) {
      const { password } = req.body || {};
      if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
      }
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: 'Incorrect password.' });
      }
    }

    if (
      user.deleteAccountCodeExpires &&
      user.deleteAccountCodeExpires > new Date(Date.now() + 9 * 60 * 1000)
    ) {
      return res.status(429).json({
        message: 'Please wait before requesting another code.',
      });
    }

    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.deleteAccountCode = hashCode(code);
    user.deleteAccountCodeExpires = codeExpires;
    await user.save();

    await sendAccountDeletionEmail(user.email, code);

    res.json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Request delete error:', error);
    res.status(500).json({ message: 'Failed to send verification email.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.deleteAccountCode || user.deleteAccountCode !== hashCode(code)) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (
      !user.deleteAccountCodeExpires ||
      user.deleteAccountCodeExpires < new Date()
    ) {
      return res.status(400).json({
        message: 'Code expired. Please request a new one.',
      });
    }

    const userId = user._id;

    const ownedTrips = await Trip.find({ userId }).select('_id');
    const ownedTripIds = ownedTrips.map((t) => t._id);

    await Promise.all([
      Message.deleteMany({ tripId: { $in: ownedTripIds } }),
      Expense.deleteMany({ tripId: { $in: ownedTripIds } }),
      Itinerary.deleteMany({ tripId: { $in: ownedTripIds } }),
      Poll.deleteMany({ tripId: { $in: ownedTripIds } }),
      Activity.deleteMany({ tripId: { $in: ownedTripIds } }),

      Message.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
      Itinerary.deleteMany({ userId }),
      Poll.deleteMany({ createdById: userId }),
      Activity.deleteMany({ userId }),

      Trip.updateMany({ members: userId }, { $pull: { members: userId } }),
      Activity.updateMany({ readBy: userId }, { $pull: { readBy: userId } }),

      Session.deleteMany({ userId }),

      Trip.deleteMany({ userId }),
    ]);

    await user.deleteOne();

    res.clearCookie('wandr_token');
    res.json({ message: 'Account and all associated data deleted.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    const GENERIC_RESPONSE = {
      message: 'If an account with that email exists and is unverified, a new code has been sent.',
    };

    if (!user) {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    if (user.isVerified) {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = hashCode(code);
    user.verificationCodeExpires = codeExpires;
    await user.save();

    await sendVerificationEmail(user.email, code);

    res.status(200).json(GENERIC_RESPONSE);
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ message: 'Google users cannot change password.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordHash = passwordHash;

    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    await Session.updateMany(
      { userId: user._id, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    const newToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        tokenVersion: user.tokenVersion,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('wandr_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    await recordSession(user._id, user.tokenVersion, req);

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.issues?.[0]?.message || error.errors?.[0]?.message || 'Validation error' });
    }
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required.' });
    }

    if (!state) {
      return res.status(400).json({ message: 'OAuth state is required.' });
    }

    const storedState = req.cookies?.wandr_oauth_state;

    if (!storedState || state !== storedState) {
      return res.status(403).json({ message: 'Invalid OAuth state.' });
    }

    res.clearCookie('wandr_oauth_state', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
      path: '/',
    });

    const googleClient = createGoogleClient();

    const { tokens } = await googleClient.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(400).json({ message: 'No ID token received from Google.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GMAIL_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'No email provided by Google.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId && !user.isVerified) {
        return res.status(403).json({
          message:
            'An account with this email already exists but is not verified. Please verify it first or use a different email.',
        });
      }

      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        user.isVerified = true;
        user.name = name || user.name || email.split('@')[0];
        user.avatar = picture || user.avatar;
        await user.save();
      } else if (!user.name || !user.name.trim()) {
        user.name = name || email.split('@')[0];
        user.avatar = picture || user.avatar;
        await user.save();
      }
    } else {
      user = new User({
        email,
        name: name || email.split('@')[0],
        avatar: picture || null,
        googleId,
        isGoogleUser: true,
        isVerified: true,
        passwordHash: null,
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        tokenVersion: user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('wandr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    await recordSession(user._id, user.tokenVersion || 0, req);

    res.json({
      message: 'Google login successful!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isGoogleUser: user.isGoogleUser,
      },
    });
  } catch (error) {
    console.error('Google login error:', error.message);

    if (
      error.message?.includes('invalid_grant') ||
      error.message?.toLowerCase().includes('invalid code')
    ) {
      return res.status(400).json({
        message: 'Sign-in link expired or already used. Please try again.',
      });
    }

    res.status(500).json({ message: 'Google login failed. Please try again.' });
  }
};

export const getGoogleAuthUrl = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString('hex');

    res.cookie('wandr_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
      maxAge: 10 * 60 * 1000,
      path: '/',
    });

    const googleClient = createGoogleClient();

    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      response_type: 'code',
      redirect_uri: `${process.env.CLIENT_URL || 'http://localhost:5173'}/google-callback`,
      prompt: 'consent',
      state,
    });

    res.json({ url });
  } catch (error) {
    console.error('Google auth URL error:', error.message);
    res.status(500).json({ message: 'Failed to generate Google auth URL.' });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const googleClient = createGoogleClient();

    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required.' });
    }

    const { tokens } = await googleClient.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GMAIL_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId && !user.isVerified) {
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=account_not_verified`
        );
      }

      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        user.isVerified = true;
        user.name = name || user.name || email.split('@')[0];
        user.avatar = picture || user.avatar;
        await user.save();
      }
    } else {
      user = new User({
        email,
        name: name || email.split('@')[0],
        avatar: picture || null,
        googleId,
        isGoogleUser: true,
        isVerified: true,
        passwordHash: null,
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        tokenVersion: user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('wandr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    await recordSession(user._id, user.tokenVersion || 0, req);

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
};