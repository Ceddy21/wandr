import User from '../models/User.js';

export const searchUsers = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const users = await User.find({
      _id: { $ne: req.userId },
      $or: [
        { name: { $regex: safeQuery, $options: 'i' } },
        { email: { $regex: safeQuery, $options: 'i' } },
      ],
    })
      .select('name email avatar')
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};