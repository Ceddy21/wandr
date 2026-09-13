import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  passwordHash: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
    index: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  verificationCodeExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleteAccountCode: {
    type: String,
    default: null,
  },
  deleteAccountCodeExpires: {
    type: Date,
    default: null,
  },
  resetCode: {
    type: String,
    default: null,
  },
  resetCodeExpires: {
    type: Date,
    default: null,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
    default: null,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);
export default User;