import Activity from '../models/Activity.js';

export const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const activities = await Activity.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name avatar')
      .populate('trip', 'name');

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};