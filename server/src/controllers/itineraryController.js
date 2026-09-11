import Itinerary from '../models/Itinerary.js';
import Trip from '../models/Trip.js';

const verifyTripAccess = async (tripId, userId) => {
  return Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { members: userId }],
  });
};

export const getItinerary = async (req, res) => {
  try {
    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const itinerary = await Itinerary.find({ tripId: req.params.id })
      .sort({ day: 1, time: 1 });

    res.json(itinerary);
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({ message: 'Failed to fetch itinerary' });
  }
};

export const addItinerary = async (req, res) => {
  try {
    const { day, time, title, type } = req.body;

    if (!day || !time || !title) {
      return res.status(400).json({ message: 'Day, time, and title are required' });
    }

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const item = new Itinerary({
      tripId: req.params.id,
      userId: req.userId,
      day: parseInt(day),
      time,
      title,
      type: type || 'activity',
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Add itinerary error:', error);
    res.status(500).json({ message: 'Failed to add itinerary item' });
  }
};

export const updateItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const { day, time, title, type } = req.body;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const item = await Itinerary.findOne({
      _id: itineraryId,
      tripId: req.params.id,
    });
    if (!item) return res.status(404).json({ message: 'Itinerary item not found' });

    if (day !== undefined) item.day = parseInt(day);
    if (time !== undefined) item.time = time;
    if (title !== undefined) item.title = title;
    if (type !== undefined) item.type = type;

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ message: 'Failed to update itinerary item' });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const item = await Itinerary.findOneAndDelete({
      _id: itineraryId,
      tripId: req.params.id,
    });
    if (!item) return res.status(404).json({ message: 'Itinerary item not found' });

    res.json({ message: 'Itinerary item deleted successfully' });
  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({ message: 'Failed to delete itinerary item' });
  }
};