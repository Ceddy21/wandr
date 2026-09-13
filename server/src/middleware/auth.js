import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.wanderly_token;

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

    // ═══════════════════════════════════════════════════════
    // SESSION REVOCATION CHECK
    // If the token's version doesn't match the user's current
    // version, the session was invalidated (e.g. password change).
    // ═══════════════════════════════════════════════════════
    const tokenVersion = decoded.tokenVersion || 0;
    const currentVersion = user.tokenVersion || 0;

    if (tokenVersion !== currentVersion) {
      return res.status(401).json({
        message: 'Session expired. Please log in again.',
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