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
        'trip_created',
        'trip_updated', 
        'trip_archived',
        'trip_unarchived',

        'member_added',
        'member_removed',

        'expense_added',
        'expense_updated',
        'expense_deleted',

        'activity_added',
        'activity_updated',
        'activity_deleted',

        'poll_created',
        'poll_deleted',
        'poll_option_added',
        'poll_option_deleted',

        'message_sent',
        'message_edited',
        'message_deleted',
      ],
      required: true,
    },

    description: { type: String, required: true },
    amount:      { type: Number, default: 0 },
    targetId:    { type: mongoose.Schema.Types.ObjectId },

    readBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
  },
  { timestamps: true }   
);

activitySchema.index({ tripId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);