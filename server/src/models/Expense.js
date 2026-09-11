import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
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
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },
  paidThrough: {
    type: String,
    enum: ['Cash', 'GCash', 'PayMaya', 'Maribank', 'BPI', 'BDO', 'Other'],
    default: 'Cash',
  },
  receiptUrl: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Expense', expenseSchema);