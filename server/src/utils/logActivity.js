import Activity from '../models/Activity.js';

export const logActivity = async ({
  tripId,
  userId,
  userName,
  userAvatar = '',
  tripName,
  type,
  description,
  amount = 0,
  targetId = null,
}) => {
  try {
    await Activity.create({
      tripId,
      userId,
      userName,
      userAvatar,
      tripName,
      type,
      description,
      amount,
      targetId,
    });
  } catch (err) {
    console.error('logActivity error:', err.message);
  }
};