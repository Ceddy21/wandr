import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { csrfProtection, generateCsrfToken } from './src/middleware/csrf.js';

dotenv.config({ path: './.env' });

import authRoutes from './src/routes/authRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import activityRoutes from './src/routes/activityRoutes.js';
import User from './src/models/User.js';
import Trip from './src/models/Trip.js';

const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'GMAIL_CLIENT_ID',
  'GMAIL_CLIENT_SECRET',
  'GMAIL_REFRESH_TOKEN',
  'GMAIL_USER_EMAIL',
  'CLIENT_URL',
];

const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters long.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(compression());
app.use(morgan('combined'));

const getAllowedOrigins = () => {
  const origins = [];

  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }

  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach((o) => {
      const trimmed = o.trim();
      if (trimmed) origins.push(trimmed);
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.push(
      'http://localhost',
      'http://localhost:80',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1',
      'http://127.0.0.1:80',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173'
    );
  }

  return [...new Set(origins)];
};

const allowedOrigins = getAllowedOrigins();
console.log('CORS allowed origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(csrfProtection);

app.use(mongoSanitize());

const SKIP_KEYS = new Set([
  'password',
  'currentPassword',
  'newPassword',
  'code',
]);

const sanitizeValue = (value, key) => {
  if (typeof value === 'string') {
    if (key && SKIP_KEYS.has(key)) return value;
    return xss(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, key));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) {
      out[k] = sanitizeValue(value[k], k);
    }
    return out;
  }
  return value;
};

const xssSanitizer = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
};

app.use(xssSanitizer);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Wandr API',
    status: 'Healthy',
    time: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/csrf-token', (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Oops! This route does not exist.' });
});

app.use((err, req, res, next) => {
  if (
    err.code === 'EBADCSRFTOKEN' ||
    err.name === 'ForbiddenError' ||
    err.message?.toLowerCase().includes('csrf') ||
    err.status === 403
  ) {
    console.warn('CSRF rejected:', err.message);
    return res.status(403).json({ message: 'Invalid CSRF token.' });
  }

  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }

  console.error('Server error:', err.message);
  res.status(500).json({
    message: 'Something went wrong on the server. Please try again later.',
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

const socketRateLimits = new Map();

const checkSocketRate = (socket, eventName, maxEvents, windowMs) => {
  const key = `${socket.id}:${eventName}`;
  const now = Date.now();

  const record = socketRateLimits.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count++;
  socketRateLimits.set(key, record);

  return record.count <= maxEvents;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of socketRateLimits.entries()) {
    if (now > record.resetAt) {
      socketRateLimits.delete(key);
    }
  }
}, 60000);

app.set('io', io);

io.use(async (socket, next) => {
  try {
    const rawCookies = socket.request.headers.cookie || '';
    const cookies = cookie.parse(rawCookies);

    const handshakeToken = socket.handshake.auth?.token;
    const token = handshakeToken || cookies.wandr_token;

    if (!token) {
      return next(new Error('Not authorized. Please log in.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      '-passwordHash -verificationCode -resetCode -deleteAccountCode'
    );

    if (!user) {
      return next(new Error('Not authorized. Please log in.'));
    }

    const tokenVersion = decoded.tokenVersion || 0;
    const currentVersion = user.tokenVersion || 0;

    if (tokenVersion !== currentVersion) {
      return next(new Error('Session expired. Please log in again.'));
    }

    socket.userId = user._id.toString();
    socket.user = user;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new Error('Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new Error('Session expired.'));
    }
    console.error('Socket auth error:', error);
    next(new Error('Authentication failed.'));
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} (user: ${socket.userId})`);

  socket.on('join-trip', async (tripId) => {
    if (!tripId) return;

    if (!checkSocketRate(socket, 'join-trip', 10, 60 * 1000)) {
      console.warn(`Rate limit: ${socket.id} spammed join-trip`);
      socket.emit('error-rate-limit', { message: 'Too many requests. Slow down.' });
      return;
    }

    try {
      const trip = await Trip.findOne({
        _id: tripId,
        $or: [{ userId: socket.userId }, { members: socket.userId }],
      }).select('_id');

      if (!trip) {
        console.warn(
          `Socket ${socket.id} (user: ${socket.userId}) tried to join unauthorized trip: ${tripId}`
        );
        socket.emit('error-trip-access', {
          message: 'You are not a member of this trip.',
        });
        return;
      }

      socket.join(`trip:${tripId}`);
      console.log(`${socket.id} joined trip:${tripId}`);
    } catch (error) {
      console.error('join-trip error:', error.message);
      socket.emit('error-trip-access', {
        message: 'Failed to join trip room.',
      });
    }
  });

  socket.on('leave-trip', (tripId) => {
    if (!tripId) return;
    socket.leave(`trip:${tripId}`);
  });

  socket.on('typing', ({ tripId, userName }) => {
    if (!tripId) return;

    if (!checkSocketRate(socket, 'typing', 30, 10 * 1000)) {
      return;
    }

    socket.to(`trip:${tripId}`).emit('user-typing', { userName });
  });

  socket.on('disconnect', () => {
    for (const key of socketRateLimits.keys()) {
      if (key.startsWith(`${socket.id}:`)) {
        socketRateLimits.delete(key);
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.io ready`);
  console.log('Security: Helmet | Compression | Rate Limiter | Sanitize | XSS');
  console.log('Auth: Email/Password + Google');
  console.log('Email: Gmail API');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});