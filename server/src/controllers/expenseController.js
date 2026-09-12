import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import { logTripActivity } from '../utils/logTripActivity.js';

const verifyTripAccess = async (tripId, userId) => {
  return Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { members: userId }],
  });
};

export const getExpenses = async (req, res) => {
  try {
    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expenses = await Expense.find({ tripId: req.params.id })
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, paidThrough, receiptUrl, date } = req.body;

    if (!description || !amount || !paidBy) {
      return res.status(400).json({ message: 'Description, amount, and paidBy are required' });
    }

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = new Expense({
      tripId: req.params.id,
      userId: req.userId,
      description,
      amount: parseFloat(amount),
      paidBy,
      paidThrough: paidThrough || 'Cash',
      receiptUrl: receiptUrl || '',
      date: date || new Date(),
    });

    await expense.save();

    // ─── Log activity ─────────────────────────────────────
    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'expense_added',
      description: `added ₱${expense.amount.toLocaleString()} for ${expense.description}`,
      targetId: expense._id,
      amount: expense.amount,
      tripName: trip.name,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, paidBy, paidThrough, receiptUrl, date } = req.body;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = await Expense.findOne({
      _id: expenseId,
      tripId: req.params.id,
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (paidBy !== undefined) expense.paidBy = paidBy;
    if (paidThrough !== undefined) expense.paidThrough = paidThrough;
    if (receiptUrl !== undefined) expense.receiptUrl = receiptUrl;
    if (date !== undefined) expense.date = date;

    await expense.save();

    // ─── Log activity ─────────────────────────────────────
    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'expense_updated',
      description: `updated expense "${expense.description}"`,
      targetId: expense._id,
      amount: expense.amount,
      tripName: trip.name,
    });

    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const trip = await verifyTripAccess(req.params.id, req.userId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      tripId: req.params.id,
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // ─── Log activity ─────────────────────────────────────
    await logTripActivity({
      userId: req.userId,
      tripId: req.params.id,
      type: 'expense_deleted',
      description: `deleted expense "${expense.description}"`,
      targetId: expense._id,
      amount: expense.amount,
      tripName: trip.name,
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};