import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.wandr_token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      '-passwordHash -verificationCode'
    );

    if (!user) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }

    const tokenVersion = decoded.tokenVersion || 0;
    const currentVersion = user.tokenVersion || 0;

    if (tokenVersion !== currentVersion) {
      return res.status(401).json({
        message: 'Session expired. Please log in again.',
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const hoursLeft = (decoded.exp - now) / 3600;

    if (hoursLeft < 12) {
      const newToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          tokenVersion: user.tokenVersion || 0,
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
    }

    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};