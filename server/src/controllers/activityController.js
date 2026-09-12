import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';

const getUserTripIds = async (userId) => {
  const trips = await Trip.find({
    $or: [{ userId }, { members: userId }],
  }).select('_id');
  return trips.map((t) => t._id);
};

// Derive a display name from a possibly-populated user doc
const resolveName = (user, fallback) => {
  if (user && typeof user === 'object') {
    if (user.name && user.name.trim()) return user.name.trim();
    if (user.email) return user.email.split('@')[0];
  }
  return fallback && fallback !== 'Someone' && fallback !== 'Unknown'
    ? fallback
    : 'Someone';
};

// Shape activity for the frontend, always using populated user if available
const shapeActivity = (activity) => {
  const obj = activity.toObject ? activity.toObject() : activity;

  // userId may be an ObjectId or a populated User object
  const populatedUser =
    obj.userId && typeof obj.userId === 'object' && obj.userId.email
      ? obj.userId
      : null;

  obj.userName = resolveName(populatedUser, obj.userName);
  obj.userAvatar = populatedUser?.avatar || obj.userAvatar || '';

  return obj;
};

const withReadFlag = (activities, userId) =>
  activities.map((a) => {
    const obj = shapeActivity(a);
    obj.isRead = (obj.readBy || []).some(
      (id) => id.toString() === userId.toString()
    );
    return obj;
  });

// ─── GET /api/activities ─────────────────────────────────
export const getActivities = async (req, res) => {
  try {
    const { tripId, type, limit = 100, excludeSelf } = req.query;
    const tripIds = await getUserTripIds(req.userId);

    const query = { tripId: { $in: tripIds } };

    if (tripId && tripId !== 'all') {
      if (!tripIds.some((id) => id.toString() === tripId)) {
        return res.json([]);
      }
      query.tripId = tripId;
    }

    if (type && type !== 'all') query.type = type;

    if (excludeSelf === 'true') {
      query.userId = { $ne: req.userId };
    }

    const activities = await Activity.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json(withReadFlag(activities, req.userId));
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};

// ─── GET /api/activities/recent ──────────────────────────
export const getRecentActivities = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 3, 20);
    const excludeSelf = req.query.excludeSelf === 'true';

    const tripIds = await getUserTripIds(req.userId);

    const query = { tripId: { $in: tripIds } };
    if (excludeSelf) query.userId = { $ne: req.userId };

    const activities = await Activity.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(withReadFlag(activities, req.userId));
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Failed to fetch recent activities' });
  }
};

// ─── GET /api/activities/trips ───────────────────────────
export const getActivityTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ userId: req.userId }, { members: req.userId }],
    })
      .select('_id name')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    console.error('Get activity trips error:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

// ─── PATCH /api/activities/:id/read ──────────────────────
export const markActivityRead = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    const trip = await Trip.findOne({
      _id: activity.tripId,
      $or: [{ userId: req.userId }, { members: req.userId }],
    });
    if (!trip) return res.status(403).json({ message: 'Not allowed' });

    if (!activity.readBy.some((id) => id.toString() === req.userId.toString())) {
      activity.readBy.push(req.userId);
      await activity.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Mark activity read error:', error);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

// ─── PATCH /api/activities/read-all ──────────────────────
export const markAllActivitiesRead = async (req, res) => {
  try {
    const tripIds = await getUserTripIds(req.userId);

    await Activity.updateMany(
      {
        tripId: { $in: tripIds },
        userId: { $ne: req.userId },
        readBy: { $ne: req.userId },
      },
      { $addToSet: { readBy: req.userId } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};