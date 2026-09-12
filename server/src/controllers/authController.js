import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { generateVerificationCode } from '../utils/generateCode.js';
import {
  sendVerificationEmail,
  sendAccountDeletionEmail,
} from '../utils/sendEmail.js';
import { registerSchema, loginSchema, verifySchema } from '../utils/validator.js';
import dotenv from "dotenv";

// ─── Models for cascade delete ─────────────────────────
import Trip from '../models/Trip.js';
import Message from '../models/Message.js';
import Expense from '../models/Expense.js';
import Itinerary from '../models/Itinerary.js';
import Poll from '../models/Polls.js';
import Activity from '../models/Activity.js';

dotenv.config({ path: './.env' });

const googleClient = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  `${process.env.CLIENT_URL || 'http://localhost:5173'}/google-callback`
);

// ═══════════════════════════════════════════════════════════
// REGISTER / VERIFY
// ═══════════════════════════════════════════════════════════

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
      verificationCode: code,
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
      return res.status(400).json({ message: error.errors[0].message });
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

    if (user.verificationCode !== code) {
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
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};

// ═══════════════════════════════════════════════════════════
// LOGIN / LOGOUT / ME
// ═══════════════════════════════════════════════════════════

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.name || !user.name.trim()) {
      user.name = user.email.split('@')[0];
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('wanderly_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('wanderly_token');
  res.json({ message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      '-passwordHash -verificationCode -deleteAccountCode'
    );
    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// ACCOUNT DELETION (2-step: request code → confirm)
// ═══════════════════════════════════════════════════════════

// ─── POST /api/auth/account/request-delete ──────────────
// Step 1: verify password, email a one-time code
export const requestAccountDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Password confirmation for non-Google users
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

    // Simple rate-limit: block re-requests within 60 seconds
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

    user.deleteAccountCode = code;
    user.deleteAccountCodeExpires = codeExpires;
    await user.save();

    await sendAccountDeletionEmail(user.email, code);

    res.json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Request delete error:', error);
    res.status(500).json({ message: 'Failed to send verification email.' });
  }
};

// ─── DELETE /api/auth/account ───────────────────────────
// Step 2: verify code, then cascade delete everything
export const deleteAccount = async (req, res) => {
  try {
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.deleteAccountCode || user.deleteAccountCode !== code) {
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

    // ─── Cascade delete ───────────────────────────────────
    const ownedTrips = await Trip.find({ userId }).select('_id');
    const ownedTripIds = ownedTrips.map((t) => t._id);

    await Promise.all([
      // Children of owned trips
      Message.deleteMany({ tripId: { $in: ownedTripIds } }),
      Expense.deleteMany({ tripId: { $in: ownedTripIds } }),
      Itinerary.deleteMany({ tripId: { $in: ownedTripIds } }),
      Poll.deleteMany({ tripId: { $in: ownedTripIds } }),
      Activity.deleteMany({ tripId: { $in: ownedTripIds } }),

      // User's contributions to any trip
      Message.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
      Itinerary.deleteMany({ userId }),
      Poll.deleteMany({ createdById: userId }),
      Activity.deleteMany({ userId }),

      // Remove user from other people's trips / activity read states
      Trip.updateMany({ members: userId }, { $pull: { members: userId } }),
      Activity.updateMany({ readBy: userId }, { $pull: { readBy: userId } }),

      // Delete owned trips themselves
      Trip.deleteMany({ userId }),
    ]);

    await user.deleteOne();

    res.clearCookie('wanderly_token');
    res.json({ message: 'Account and all associated data deleted.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════════
// RESEND VERIFICATION / CHANGE PASSWORD
// ═══════════════════════════════════════════════════════════

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This email is already verified.' });
    }

    const code = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = code;
    user.verificationCodeExpires = codeExpires;
    await user.save();

    await sendVerificationEmail(email, code);

    res.json({ message: 'New verification code sent to your email.' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
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
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════════
// GOOGLE OAUTH
// ═══════════════════════════════════════════════════════════

export const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required.' });
    }

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
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('wanderly_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    res.status(500).json({ message: 'Google login failed. Please try again.' });
  }
};

export const getGoogleAuthUrl = async (req, res) => {
  try {
    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      response_type: 'code',
      redirect_uri: `${process.env.CLIENT_URL || 'http://localhost:5173'}/google-callback`,
      prompt: 'consent',
    });

    res.json({ url });
  } catch (error) {
    console.error('Google auth URL error:', error.message);
    res.status(500).json({ message: 'Failed to generate Google auth URL.' });
  }
};

export const googleCallback = async (req, res) => {
  try {
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
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('wanderly_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
};