import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getActivities,
  getRecentActivities,
  getActivityTrips,
  markActivityRead,
  markAllActivitiesRead,
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/recent', protect, getRecentActivities);
router.get('/trips', protect, getActivityTrips);
router.patch('/read-all', protect, markAllActivitiesRead);

router.patch('/:id/read', protect, markActivityRead);

router.get('/', protect, getActivities);

export default router;