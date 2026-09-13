import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
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
  },
  user: { type: String, required: true },   
  text: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Optimize lookups by trip + time
messageSchema.index({ tripId: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema);