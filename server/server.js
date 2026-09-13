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

dotenv.config({ path: './.env' });

import authRoutes from './src/routes/authRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import activityRoutes from './src/routes/activityRoutes.js';

// ═══════════════════════════════════════════════════════════
// ENV VALIDATION
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// MONGOOSE
// ═══════════════════════════════════════════════════════════

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════

const app = express();

// ─── Trust proxy — must be set BEFORE rate limiters ───────
app.set('trust proxy', 1);

// ─── Helmet ───────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
// CORS — env-driven origin whitelist
//
// DEVELOPMENT: auto-allows localhost on common ports
// PRODUCTION:  only allows CLIENT_URL + ALLOWED_ORIGINS
// ═══════════════════════════════════════════════════════════

const getAllowedOrigins = () => {
  const origins = [];

  // Primary client URL (dev or prod)
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }

  // Additional origins (comma-separated list)
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach((o) => {
      const trimmed = o.trim();
      if (trimmed) origins.push(trimmed);
    });
  }

  // Dev-only origins — added automatically when NODE_ENV != production
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

  // Dedupe
  return [...new Set(origins)];
};

const allowedOrigins = getAllowedOrigins();
console.log('CORS allowed origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
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

// ═══════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// ═══════════════════════════════════════════════════════════
// BODY PARSERS / COOKIES / SANITIZE
// ═══════════════════════════════════════════════════════════

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

// ─── XSS sanitizer ────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
// HEALTH / ROOT
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

// ═══════════════════════════════════════════════════════════
// 404 + ERROR HANDLERS
// ═══════════════════════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({ message: 'Oops! This route does not exist.' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    message: 'Something went wrong on the server. Please try again later.',
  });
});

// ═══════════════════════════════════════════════════════════
// SOCKET.IO
// ═══════════════════════════════════════════════════════════

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join-trip', (tripId) => {
    if (!tripId) return;
    socket.join(`trip:${tripId}`);
    console.log(`${socket.id} joined trip:${tripId}`);
  });

  socket.on('leave-trip', (tripId) => {
    if (!tripId) return;
    socket.leave(`trip:${tripId}`);
  });

  socket.on('typing', ({ tripId, userName }) => {
    if (!tripId) return;
    socket.to(`trip:${tripId}`).emit('user-typing', { userName });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ═══════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.io ready`);
  console.log('Security: Helmet | Compression | Rate Limiter | Sanitize | XSS');
  console.log('Auth: Email/Password + Google');
  console.log('Email: Gmail API');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});