import {
  Activity,
  DollarSign,
  Pencil,
  Trash2,
  UserPlus,
  UserMinus,
  MapPin,
  Plus,
  Plane,
  Archive,
  ArchiveRestore,
  FileText,
  PlusCircle,
  MinusCircle,
  MessageCircle,
} from 'lucide-react';

// ─── Icon ────────────────────────────────────────────────
export function getActivityIcon(type, className = 'w-4 h-4') {
  switch (type) {
    // Expenses
    case 'expense_added':   return <DollarSign className={className} />;
    case 'expense_updated': return <Pencil className={className} />;
    case 'expense_deleted': return <Trash2 className={className} />;

    // Members
    case 'member_added':    return <UserPlus className={className} />;
    case 'member_removed':  return <UserMinus className={className} />;

    // Itinerary
    case 'activity_added':   return <MapPin className={className} />;
    case 'activity_updated': return <Pencil className={className} />;
    case 'activity_deleted': return <Trash2 className={className} />;

    // Trips
    case 'trip_created':    return <Plane className={className} />;
    case 'trip_archived':   return <Archive className={className} />;
    case 'trip_unarchived': return <ArchiveRestore className={className} />;

    // Polls
    case 'poll_created':        return <FileText className={className} />;
    case 'poll_deleted':        return <Trash2 className={className} />;
    case 'poll_option_added':   return <PlusCircle className={className} />;
    case 'poll_option_deleted': return <MinusCircle className={className} />;

    // Chat
    case 'message_sent':    return <MessageCircle className={className} />;
    case 'message_edited':  return <Pencil className={className} />;
    case 'message_deleted': return <Trash2 className={className} />;

    default: return <Activity className={className} />;
  }
}

// ─── Color ───────────────────────────────────────────────
export function getActivityColor(type) {
  // Broad rules first
  if (type.endsWith('_deleted')) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }
  if (type.endsWith('_updated') || type.endsWith('_edited')) {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  }

  switch (type) {
    case 'expense_added':       return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'member_added':        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'member_removed':      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'activity_added':      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'trip_created':        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'trip_archived':
    case 'trip_unarchived':     return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'poll_created':        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    case 'poll_option_added':   return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    case 'poll_option_deleted': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'message_sent':        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
    default:                    return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
  }
}

// ─── Link ────────────────────────────────────────────────
export function getActivityLink(activity) {
  const { tripId, type } = activity;
  if (!tripId) return null;

  const base = `/trip/${tripId}`;

  // Deleted items have no target; just land on the trip page
  if (type.endsWith('_deleted')) return base;

  switch (type) {
    case 'expense_added':
    case 'expense_updated':       return `${base}?tab=expenses`;

    case 'activity_added':
    case 'activity_updated':      return `${base}?tab=itinerary`;

    case 'member_added':
    case 'member_removed':        return `${base}?tab=members`;

    case 'poll_created':
    case 'poll_option_added':
    case 'poll_option_deleted':   return `${base}?tab=polls`;

    case 'message_sent':
    case 'message_edited':        return `${base}?tab=chat`;

    case 'trip_created':
    case 'trip_archived':
    case 'trip_unarchived':
    default:                      return base;
  }
}

// ─── Time formatter ──────────────────────────────────────
export function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}