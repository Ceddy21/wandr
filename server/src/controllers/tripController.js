import Trip from '../models/Trip.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

const findMemberTrip = (tripId, userId) =>
  Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { members: userId }],
  });

const findOwnedTrip = (tripId, userId) =>
  Trip.findOne({ _id: tripId, userId });

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
    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Failed to create trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or you are not the owner' });
    }

    await trip.deleteOne();
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

    trip.members = trip.members.filter((m) => m.toString() !== userId);

    await trip.save();
    await trip.populate('members', 'name email avatar');
    res.json(trip);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Failed to remove member' });
  }
};