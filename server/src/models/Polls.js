import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true,
  },
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      addedByName: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  votes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      optionText: { type: String, required: true },
      votedAt: { type: Date, default: Date.now },
    },
  ],
  createdBy: { type: String, required: true },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Poll', pollSchema);