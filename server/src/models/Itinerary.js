import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
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
  day: { type: Number, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'restaurant', 'activity'],
    default: 'activity',
  },
  createdAt: { type: Date, default: Date.now },

  completed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Itinerary', itinerarySchema);