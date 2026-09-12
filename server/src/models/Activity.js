// src/models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName:   { type: String, required: true },
    userAvatar: { type: String, default: '' },
    tripName:   { type: String, required: true },

    type: {
      type: String,
      enum: [
        // ─── Trips ──────────────────────────────────────
        'trip_created',
        'trip_archived',
        'trip_unarchived',

        // ─── Members ────────────────────────────────────
        'member_added',
        'member_removed',

        // ─── Expenses ───────────────────────────────────
        'expense_added',
        'expense_updated',
        'expense_deleted',

        // ─── Itinerary ──────────────────────────────────
        'activity_added',
        'activity_updated',
        'activity_deleted',

        // ─── Polls ──────────────────────────────────────
        'poll_created',
        'poll_deleted',
        'poll_option_added',
        'poll_option_deleted',

        // ─── Chat ───────────────────────────────────────
        'message_sent',
        'message_edited',
        'message_deleted',
      ],
      required: true,
    },

    description: { type: String, required: true },
    amount:      { type: Number, default: 0 },
    targetId:    { type: mongoose.Schema.Types.ObjectId },

    // ─── Users who marked this activity as read ───────────
    readBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
  },
  { timestamps: true }   // auto-manages createdAt + updatedAt
);

// Compound indexes for fast filtering
activitySchema.index({ tripId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);