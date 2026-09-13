import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { activityService } from '../services/activityService';

function collapseMessages(list, windowMs = 5 * 60 * 1000) {
  const out = [];
  for (const a of list) {
    const prev = out[out.length - 1];

    const sameUser =
      prev &&
      String(prev.userId?._id || prev.userId) ===
        String(a.userId?._id || a.userId);

    const bothMessages =
      prev?.type === 'message_sent' && a.type === 'message_sent';

    const withinWindow =
      prev &&
      new Date(prev.createdAt).getTime() -
        new Date(a.createdAt).getTime() <
        windowMs;

    if (sameUser && bothMessages && withinWindow) {
      continue;
    }
    out.push(a);
  }
  return out;
}

export function useNotifications({ filter = 'all', page = 1, perPage = 10 } = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await activityService.getFiltered({
        limit: 200,
        excludeSelf: true, 
      });
      setActivities(collapseMessages(data));
    } catch (err) {
      toast.error(err.message || 'Failed to load notifications');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const markRead = async (id) => {
    setActivities((prev) =>
      prev.map((a) => (a._id === id ? { ...a, isRead: true } : a))
    );
    try {
      await activityService.markRead(id);
    } catch {
      setActivities((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isRead: false } : a))
      );
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    const prev = activities;
    setActivities((list) => list.map((a) => ({ ...a, isRead: true })));
    try {
      await activityService.markAllRead();
    } catch {
      setActivities(prev);
      toast.error('Failed to mark all as read');
    }
  };

  const filtered =
    filter === 'unread'
      ? activities.filter((a) => !a.isRead)
      : filter === 'read'
      ? activities.filter((a) => a.isRead)
      : activities;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const unreadCount = activities.filter((a) => !a.isRead).length;

  return {
    activities: paginated,
    allActivities: activities,
    loading,
    unreadCount,
    total,
    totalPages,
    markRead,
    markAllRead,
    refetch: fetchAll,
  };
}