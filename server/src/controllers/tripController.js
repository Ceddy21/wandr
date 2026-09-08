import Trip from '../models/Trip.js';

export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('members', 'name email avatar');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Failed to fetch trip' });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, members } = req.body;

    const trip = new Trip({
      name,
      destination,
      startDate,
      endDate,
      members: members || 1,
      userId: req.userId,
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Failed to create trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Failed to delete trip' });
  }
};

export const archiveTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: 'archived' },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Archive trip error:', error);
    res.status(500).json({ message: 'Failed to archive trip' });
  }
};