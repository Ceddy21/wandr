import express from 'express';
import { protect } from '../middleware/auth.js';
import { getRecentActivities } from '../controllers/activityController.js';

const router = express.Router();

router.get('/recent', protect, getRecentActivities);

export default router;