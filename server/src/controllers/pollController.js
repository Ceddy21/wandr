import Poll from '../models/Polls.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { logTripActivity } from '../utils/logTripActivity.js';

const verifyTripAccess = async (tripId, userId) => {
  return await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { members: userId }],
  });
};

export const getPolls = async (req, res) => {
  try {
    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const polls = await Poll.find({ tripId: req.params.id })
      .sort({ createdAt: -1 });

    res.json(polls);
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ message: 'Failed to fetch polls' });
  }
};

export const addPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: 'Question and at least 2 options are required',
      });
    }

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const user = await User.findById(req.userId).select('name email');
    const creatorName =
      user?.name || user?.email?.split('@')[0] || 'Someone';

    const cleanOptions = options
      .map((opt) => String(opt).trim())
      .filter(Boolean)
      .map((text) => ({
        text,
        addedBy: req.userId,
        addedByName: creatorName,
      }));

    const poll = new Poll({
      tripId: req.params.id,
      question: String(question).trim(),
      options: cleanOptions,
      votes: [],
      createdBy: creatorName,
      createdById: req.userId,
    });

    await poll.save();

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'poll_created',
      description: `created poll "${poll.question}"`,
      targetId: poll._id,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('poll-updated');

    res.status(201).json(poll);
  } catch (error) {
    console.error('Add poll error:', error);
    res.status(500).json({ message: 'Failed to create poll' });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const poll = await Poll.findOne({ _id: pollId, tripId: req.params.id });
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    if (poll.createdById.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Only the poll creator can delete this poll',
      });
    }

    const pollQuestion = poll.question;
    const pollIdRef = poll._id;
    await poll.deleteOne();

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'poll_deleted',
      description: `deleted poll "${pollQuestion}"`,
      targetId: pollIdRef,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('poll-updated');

    res.json({ message: 'Poll deleted' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ message: 'Failed to delete poll' });
  }
};

export const addPollChoice = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Choice text is required' });
    }

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const poll = await Poll.findOne({ _id: pollId, tripId: req.params.id });
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const exists = poll.options.some(
      (o) => o.text.toLowerCase() === text.trim().toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ message: 'That choice already exists' });
    }

    const user = await User.findById(req.userId).select('name email');
    const userName =
      user?.name || user?.email?.split('@')[0] || 'Someone';

    poll.options.push({
      text: text.trim(),
      addedBy: req.userId,
      addedByName: userName,
    });

    await poll.save();

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'poll_option_added',
      description: `added option "${text.trim()}" to "${poll.question}"`,
      targetId: poll._id,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('poll-updated');

    res.json(poll);
  } catch (error) {
    console.error('Add poll choice error:', error);
    res.status(500).json({ message: 'Failed to add choice' });
  }
};

export const deletePollChoice = async (req, res) => {
  try {
    const { pollId, choiceId } = req.params;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const poll = await Poll.findOne({ _id: pollId, tripId: req.params.id });
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const choice = poll.options.id(choiceId);
    if (!choice) return res.status(404).json({ message: 'Choice not found' });

    if (choice.addedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'You can only delete choices you added',
      });
    }

    const choiceText = choice.text;
    const pollQuestion = poll.question;
    poll.options.pull(choiceId);
    poll.votes = poll.votes.filter((v) => v.optionText !== choiceText);

    await poll.save();

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'poll_option_deleted',
      description: `removed option "${choiceText}" from "${pollQuestion}"`,
      targetId: poll._id,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('poll-updated');

    res.json(poll);
  } catch (error) {
    console.error('Delete poll choice error:', error);
    res.status(500).json({ message: 'Failed to delete choice' });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionText } = req.body;

    if (!optionText) {
      return res.status(400).json({ message: 'optionText is required' });
    }

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const poll = await Poll.findOne({ _id: pollId, tripId: req.params.id });
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const optionExists = poll.options.some((o) => o.text === optionText);
    if (!optionExists) {
      return res.status(400).json({ message: 'Invalid option' });
    }

    poll.votes = poll.votes.filter(
      (v) => v.userId.toString() !== req.userId.toString()
    );

    poll.votes.push({
      userId: req.userId,
      optionText,
      votedAt: new Date(),
    });

    await poll.save();

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('poll-updated');

    res.json(poll);
  } catch (error) {
    console.error('Vote poll error:', error);
    res.status(500).json({ message: 'Failed to vote' });
  }
};