import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getTrip,
  getTrips,
  createTrip,
  deleteTrip,
  archiveTrip
} from '../controllers/tripController.js';

const router = express.Router();

router.route('/')
  .get(protect, getTrips)
  .post(protect, createTrip);

router.route('/:id')
  .get(protect, getTrip)
  .delete(protect, deleteTrip);

router.put('/:id/archive', protect, archiveTrip);

export default router;