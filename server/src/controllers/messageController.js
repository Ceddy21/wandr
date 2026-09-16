import Message from '../models/Message.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { logTripActivity } from '../utils/logTripActivity.js';

const REPLY_POPULATE_FIELDS = 'user text imageUrl deleted userId createdAt';

const verifyTripAccess = async (tripId, userId) => {
  return await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { members: userId }],
  });
};

export const getMessages = async (req, res) => {
  try {
    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const messages = await Message.find({ tripId: req.params.id })
      .populate('replyTo', REPLY_POPULATE_FIELDS)
      .sort({ createdAt: 1 })
      .limit(500);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { text, imageUrl, replyTo } = req.body;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Text or image is required' });
    }

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    let replyToId = null;
    if (replyTo) {
      if (!mongoose.Types.ObjectId.isValid(replyTo)) {
        return res.status(400).json({ message: 'Invalid replyTo id' });
      }
      const original = await Message.findOne({
        _id: replyTo,
        tripId: req.params.id,
      }).select('_id');
      if (!original) {
        return res.status(400).json({ message: 'Reply target not found' });
      }
      replyToId = original._id;
    }

    const sender = await User.findById(req.userId).select('name email');
    const senderName =
      sender?.name || sender?.email?.split('@')[0] || 'Unknown';

    const message = new Message({
      tripId: req.params.id,
      userId: req.userId,
      user: senderName,
      text: text || '',
      imageUrl: imageUrl || '',
      status: 'sent',
      replyTo: replyToId,
    });

    await message.save();
    await message.populate('replyTo', REPLY_POPULATE_FIELDS);

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'message_sent',
      description: 'sent a message in the trip chat',
      targetId: message._id,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('new-message', message);

    res.status(201).json(message);
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: 'Text is required' });

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const message = await Message.findOne({
      _id: messageId,
      tripId: req.params.id,
    });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'You can only edit your own messages',
      });
    }

    message.text = text;
    message.edited = true;
    await message.save();
    await message.populate('replyTo', REPLY_POPULATE_FIELDS);

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'message_edited',
      description: 'edited a chat message',
      targetId: message._id,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('message-updated', message);

    res.json(message);
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Failed to edit message' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const message = await Message.findOne({
      _id: messageId,
      tripId: req.params.id,
    });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own messages',
      });
    }

    message.deleted = true;
    message.text = '';
    message.imageUrl = '';
    await message.save();
    await message.populate('replyTo', REPLY_POPULATE_FIELDS);

    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'message_deleted',
      description: 'deleted a chat message',
      targetId: message._id,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('message-updated', message);

    res.json(message);
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    await Message.updateMany(
      {
        tripId: req.params.id,
        userId: { $ne: req.userId },
        status: { $ne: 'read' },
      },
      { $set: { status: 'read' } }
    );

    const messages = await Message.find({ tripId: req.params.id })
      .populate('replyTo', REPLY_POPULATE_FIELDS)
      .sort({ createdAt: 1 });

    const io = req.app.get('io');
    if (io) io.to(`trip:${req.params.id}`).emit('messages-read', {
      userId: req.userId,
      tripId: req.params.id,
    });

    res.json(messages);
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};