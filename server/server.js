import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import dotenv from "dotenv";
import mongoose from 'mongoose';  // <-- FIX 1: Added this

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)  // <-- FIX 2: Added this
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.error('❌ MongoDB Error:', err.message));

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many request from this IP. Please try again later.',
});

app.use('/api', limiter);  // <-- FIX 3: Added the leading slash

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Wanderly API!',  // I changed this to Wanderly
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

app.use((req, res) => {
    res.status(404).json({
        message: 'Ooops! This route does not exist.'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        message: 'Something went wrong on the server. Please try again later.',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Security: Helmet | Rate Limiter | Mongo Sanitize | XSS Clean`);
});