import express from 'express';
import { protect } from '../middleware/auth.js';

import {
  getTrip,
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  archiveTrip,
  unarchiveTrip,
  addMember,
  removeMember,
  joinTripByCode,
  getOrCreateShareCode,
} from '../controllers/tripController.js';

import {
  getMessages,
  addMessage,
  editMessage,
  deleteMessage,
  markMessagesRead,
} from '../controllers/messageController.js';

import {
  getPolls,
  addPoll,
  deletePoll,
  addPollChoice,
  deletePollChoice,
  votePoll,
} from '../controllers/pollController.js';

import {
  getItinerary,
  addItinerary,
  updateItinerary,
  deleteItinerary,
} from '../controllers/itineraryController.js';

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

router.post('/join/:code', protect, joinTripByCode);

router.route('/')
  .get(protect, getTrips)
  .post(protect, createTrip);

router.route('/:id')
  .get(protect, getTrip)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

router.put('/:id/archive', protect, archiveTrip);
router.put('/:id/unarchive', protect, unarchiveTrip);

router.post('/:id/share-code', protect, getOrCreateShareCode);

router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, addMessage);
router.put('/:id/messages/mark-read', protect, markMessagesRead);
router.put('/:id/messages/:messageId', protect, editMessage);
router.delete('/:id/messages/:messageId', protect, deleteMessage);

router.get('/:id/polls', protect, getPolls);
router.post('/:id/polls', protect, addPoll);
router.delete('/:id/polls/:pollId', protect, deletePoll);
router.post('/:id/polls/:pollId/choices', protect, addPollChoice);
router.delete('/:id/polls/:pollId/choices/:choiceId', protect, deletePollChoice);
router.put('/:id/polls/:pollId/vote', protect, votePoll);

router.get('/:id/itinerary', protect, getItinerary);
router.post('/:id/itinerary', protect, addItinerary);
router.put('/:id/itinerary/:itineraryId', protect, updateItinerary);
router.delete('/:id/itinerary/:itineraryId', protect, deleteItinerary);

router.get('/:id/expenses', protect, getExpenses);
router.post('/:id/expenses', protect, addExpense);
router.put('/:id/expenses/:expenseId', protect, updateExpense);
router.delete('/:id/expenses/:expenseId', protect, deleteExpense);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

export default router;