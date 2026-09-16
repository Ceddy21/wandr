import Trip from '../models/Trip.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/User.js';
import { logTripActivity } from '../utils/logTripActivity.js';

const notifyTripChange = (io, trip, excludeUserId = null) => {
  if (!io || !trip) return;

  const memberIds = new Set();

  if (trip.userId) {
    memberIds.add(trip.userId.toString());
  }

  if (Array.isArray(trip.members)) {
    trip.members.forEach((m) => {
      const id = m._id ? m._id.toString() : m.toString();
      memberIds.add(id);
    });
  }

  memberIds.forEach((id) => {
    if (excludeUserId && id === excludeUserId.toString()) return;
    io.to(`user:${id}`).emit('trips-changed', {
      tripId: trip._id.toString(),
    });
  });
};

const findMemberTrip = (tripId, userId) =>
  Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { members: userId }],
  });

const findOwnedTrip = (tripId, userId) =>
  Trip.findOne({ _id: tripId, userId });

const generateShareCode = () => {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return code;
};

export const getTrip = async (req, res) => {
  try {
    const trip = await findMemberTrip(req.params.id, req.userId)
      .populate('members', 'name email avatar');

    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Failed to fetch trip' });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ userId: req.userId }, { members: req.userId }],
    })
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, members, targetMembers } = req.body;

    let memberArray = [];
    if (Array.isArray(members)) {
      memberArray = members.filter((id) => mongoose.Types.ObjectId.isValid(id));
    } else if (typeof members === 'string') {
      const cleaned = members.replace(/[\[\]\s"]/g, '');
      const parts = cleaned.split(',').filter(Boolean);
      memberArray = parts.filter((id) => mongoose.Types.ObjectId.isValid(id));
    }

    if (!memberArray.some((id) => id.toString() === req.userId.toString())) {
      memberArray.push(req.userId);
    }

    const parsedTarget = parseInt(targetMembers, 10);
    const validTarget = !isNaN(parsedTarget) && parsedTarget >= 1 ? parsedTarget : 1;

    const trip = new Trip({
      name,
      destination,
      startDate,
      endDate,
      members: memberArray,
      targetMembers: validTarget,
      userId: req.userId,
    });

    await trip.save();
    await trip.populate('members', 'name email avatar');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'trip_created',
      description: 'created the trip',
      targetId: trip._id,
      tripName: trip.name,
    });

    notifyTripChange(req.app.get('io'), trip, req.userId);

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Failed to create trip' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or you are not the owner' });
    }

    const { name, destination, startDate, endDate, targetMembers } = req.body;

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return res.status(400).json({ message: 'Name cannot be empty' });
      }
      trip.name = trimmed;
    }

    if (destination !== undefined) {
      const trimmed = String(destination).trim();
      if (!trimmed) {
        return res.status(400).json({ message: 'Destination cannot be empty' });
      }
      trip.destination = trimmed;
    }

    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;

    if (targetMembers !== undefined) {
      const parsed = parseInt(targetMembers, 10);
      if (!isNaN(parsed) && parsed >= 1) trip.targetMembers = parsed;
    }

    await trip.save();
    await trip.populate('members', 'name email avatar');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'trip_updated',
      description: 'updated the trip details',
      targetId: trip._id,
      tripName: trip.name,
    });

    notifyTripChange(req.app.get('io'), trip, req.userId);

    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Failed to update trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or you are not the owner' });
    }

    const io = req.app.get('io');
    const snapshot = {
      _id: trip._id,
      userId: trip.userId,
      members: trip.members,
    };

    await trip.deleteOne();

    notifyTripChange(io, snapshot, null);

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Failed to delete trip' });
  }
};

export const archiveTrip = async (req, res) => {
  try {
    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or you are not the owner' });
    }

    trip.status = 'archived';
    await trip.save();
    await trip.populate('members', 'name email avatar');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'trip_archived',
      description: 'archived the trip',
      targetId: trip._id,
      tripName: trip.name,
    });

    notifyTripChange(req.app.get('io'), trip, req.userId);

    res.json(trip);
  } catch (error) {
    console.error('Archive trip error:', error);
    res.status(500).json({ message: 'Failed to archive trip' });
  }
};

export const unarchiveTrip = async (req, res) => {
  try {
    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or you are not the owner' });
    }

    trip.status = 'upcoming';
    await trip.save();
    await trip.populate('members', 'name email avatar');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'trip_unarchived',
      description: 'unarchived the trip',
      targetId: trip._id,
      tripName: trip.name,
    });

    notifyTripChange(req.app.get('io'), trip, req.userId);

    res.json(trip);
  } catch (error) {
    console.error('Unarchive trip error:', error);
    res.status(500).json({ message: 'Failed to unarchive trip' });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Valid userId is required' });
    }

    const trip = await findMemberTrip(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!Array.isArray(trip.members)) trip.members = [];

    const alreadyMember = trip.members.some((m) => m.toString() === userId.toString());
    if (!alreadyMember) trip.members.push(userId);

    await trip.save();
    await trip.populate('members', 'name email avatar');

    if (!alreadyMember) {
      const added = await User.findById(userId).select('name');

      await logTripActivity({
        userId: req.userId,
        tripId: trip._id,
        type: 'member_added',
        description: `added ${added?.name || 'a member'} to the trip`,
        targetId: userId,
        tripName: trip.name,
      });

      notifyTripChange(req.app.get('io'), trip, req.userId);
    }

    res.json(trip);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Failed to add member' });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found or you are not the owner',
      });
    }

    if (!Array.isArray(trip.members)) trip.members = [];

    const removed = await User.findById(userId).select('name');

    trip.members = trip.members.filter((m) => m.toString() !== userId);

    await trip.save();
    await trip.populate('members', 'name email avatar');

    if (removed) {
      await logTripActivity({
        userId: req.userId,
        tripId: trip._id,
        type: 'member_removed',
        description: `removed ${removed.name} from the trip`,
        targetId: userId,
        tripName: trip.name,
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${userId}`).emit('trips-changed', {
        tripId: trip._id.toString(),
      });
      io.to(`user:${userId}`).emit('removed-from-trip', {
        tripId: trip._id.toString(),
        tripName: trip.name,
      });
    }
    notifyTripChange(io, trip, req.userId);

    res.json(trip);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Failed to remove member' });
  }
};

export const getOrCreateShareCode = async (req, res) => {
  try {
    const trip = await findMemberTrip(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.shareCode) {
      return res.json({ shareCode: trip.shareCode });
    }

    let code;
    let attempts = 0;
    do {
      code = generateShareCode();
      attempts++;
      if (attempts > 5) {
        return res
          .status(500)
          .json({ message: 'Could not generate code, please try again' });
      }
    } while (await Trip.exists({ shareCode: code }));

    trip.shareCode = code;
    trip.shareCodeCreatedAt = new Date();
    await trip.save();

    res.json({ shareCode: trip.shareCode });
  } catch (error) {
    console.error('Share code error:', error);
    res.status(500).json({ message: 'Failed to generate share code' });
  }
};

export const joinTripByCode = async (req, res) => {
  try {
    const code = String(req.params.code).toUpperCase().trim();

    const trip = await Trip.findOne({ shareCode: code });
    if (!trip) return res.status(404).json({ message: 'Invalid code' });

    const alreadyMember = trip.members.some(
      (m) => m.toString() === req.userId.toString()
    );

    if (alreadyMember) {
      return res.json({
        message: 'You are already a member',
        tripId: trip._id,
      });
    }

    trip.members.push(req.userId);
    await trip.save();
    await trip.populate('members', 'name email avatar');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'member_added',
      description: 'joined the trip via share code',
      targetId: req.userId,
      tripName: trip.name,
    });

    notifyTripChange(req.app.get('io'), trip, null);

    res.json({ message: 'Joined trip', tripId: trip._id });
  } catch (error) {
    console.error('Join trip error:', error);
    res.status(500).json({ message: 'Failed to join trip' });
  }
};
export const leaveTrip = async (req, res) => {
  try {
    const trip = await findMemberTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const userId = req.userId.toString();
    const ownerId = trip.userId?.toString();

    if (userId === ownerId) {
      return res.status(400).json({
        message: 'As the owner, you must transfer ownership before leaving.',
      });
    }

    if (!Array.isArray(trip.members)) trip.members = [];

    const isMember = trip.members.some(
      (m) => (m._id ? m._id.toString() : m.toString()) === userId
    );

    if (!isMember) {
      return res.status(400).json({ message: 'You are not a member of this trip.' });
    }

    trip.members = trip.members.filter(
      (m) => (m._id ? m._id.toString() : m.toString()) !== userId
    );

    await trip.save();
    await trip.populate('members', 'name email avatar');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'member_left',
      description: 'left the trip',
      targetId: req.userId,
      tripName: trip.name,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${userId}`).emit('trips-changed', {
        tripId: trip._id.toString(),
      });
      io.to(`user:${userId}`).emit('removed-from-trip', {
        tripId: trip._id.toString(),
        tripName: trip.name,
      });
    }
    notifyTripChange(io, trip, req.userId);

    res.json({ message: 'Left trip successfully.' });
  } catch (error) {
    console.error('Leave trip error:', error);
    res.status(500).json({ message: 'Failed to leave trip' });
  }
};

export const transferOwnership = async (req, res) => {
  try {
    const { newOwnerId } = req.body;

    if (!newOwnerId || !mongoose.Types.ObjectId.isValid(newOwnerId)) {
      return res.status(400).json({ message: 'Valid newOwnerId is required.' });
    }

    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found or you are not the owner.',
      });
    }

    const currentOwnerId = req.userId.toString();
    const newOwnerIdStr = newOwnerId.toString();

    if (currentOwnerId === newOwnerIdStr) {
      return res.status(400).json({
        message: 'You are already the owner.',
      });
    }

    if (!Array.isArray(trip.members)) trip.members = [];

    const isMember = trip.members.some(
      (m) => (m._id ? m._id.toString() : m.toString()) === newOwnerIdStr
    );

    if (!isMember) {
      return res.status(400).json({
        message: 'The new owner must be a member of this trip.',
      });
    }

    trip.userId = newOwnerId;
    await trip.save();
    await trip.populate('members', 'name email avatar');

    const newOwner = await User.findById(newOwnerId).select('name');

    await logTripActivity({
      userId: req.userId,
      tripId: trip._id,
      type: 'ownership_transferred',
      description: `transferred ownership to ${newOwner?.name || 'a member'}`,
      targetId: newOwnerId,
      tripName: trip.name,
    });

    notifyTripChange(req.app.get('io'), trip, null);

    res.json(trip);
  } catch (error) {
    console.error('Transfer ownership error:', error);
    res.status(500).json({ message: 'Failed to transfer ownership' });
  }
};