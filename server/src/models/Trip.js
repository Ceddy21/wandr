import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  members: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'archived'],
    default: 'upcoming'
  },
  progress: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Trip', tripSchema);