import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { logActivity } from './logActivity.js';

/**
 * Derive a display name from a User document.
 * Priority: name → email prefix → "Someone"
 */
function displayName(user) {
  if (!user) return 'Someone';
  if (user.name && user.name.trim()) return user.name.trim();
  if (user.email) return user.email.split('@')[0];
  return 'Someone';
}

export async function logTripActivity({
  userId,
  tripId,
  type,
  description,
  targetId,
  amount,
  tripName,
  userName,
  userAvatar,
}) {
  try {
    let name = userName;
    let avatar = userAvatar;
    let tName = tripName;

    if (!name || !tName) {
      const [user, trip] = await Promise.all([
        !name ? User.findById(userId).select('name email avatar') : null,
        !tName ? Trip.findById(tripId).select('name') : null,
      ]);

      if (user && !name) {
        name = displayName(user);
        avatar = user.avatar || '';
      }
      if (trip && !tName) {
        tName = trip.name;
      }
    }

    return await logActivity({
      tripId,
      userId,
      userName: name || 'Someone',
      userAvatar: avatar || '',
      tripName: tName || 'a trip',
      type,
      description,
      targetId,
      amount,
    });
  } catch (err) {
    console.error('logTripActivity error:', err);
  }
}