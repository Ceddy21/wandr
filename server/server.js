import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

dotenv.config({ path: './.env' });

import authRoutes from './src/routes/authRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import activityRoutes from './src/routes/activityRoutes.js';

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

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
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
        console.error('MongoDB connection error: ', err.message);
        process.exit(1);
});

const app = express();

app.use(helmet({
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
        },
    },
}));

app.use(compression());
app.use(morgan('combined'));

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
}));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 80,
    message: 'Too many request from this IP. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', globalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

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

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Ooops! This route does not exist.',
    });
});

app.use((err, req, res, next) => {
    console.error('Server error: ', err.message);
    res.status(500).json({
        message: 'Something went wrong on the server. Please try again later.',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Security: Helmet(HSTS + CSP) | Compression | Rate Limiter | Mongo Sanitize | XSS Clean | HttpOnly Cookie');
    console.log(`Auth: Email/Password + google Auth`);
    console.log(`Email: Gmail API(OAuth 2.0)`);
});