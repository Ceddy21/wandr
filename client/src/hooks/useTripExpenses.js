import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';

const getDefaultPaidBy = (trip) => {
  if (!trip?.members?.length) return '';
  const admin = trip.members.find((m) => m.role === 'admin');
  return admin?.name || trip.members[0]?.name || '';
};

export const useTripExpenses = (tripId, trip) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    paidThrough: 'Cash',
    receiptUrl: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!tripId) return;
      setLoading(true);
      try {
        const data = await tripService.getExpenses(tripId);
        setExpenses(data);
      } catch (err) {
        console.error('Fetch expenses error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [tripId]);

  useEffect(() => {
    if (trip?.members?.length) {
      setNewExpense((prev) =>
        prev.paidBy ? prev : { ...prev, paidBy: getDefaultPaidBy(trip) }
      );
    }
  }, [trip]);

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
      toast.error('Please fill in all fields');
      return { success: false };
    }

    const online = ['GCash', 'PayMaya', 'Maribank', 'BPI', 'BDO', 'Other'];
    if (online.includes(newExpense.paidThrough) && !newExpense.receiptUrl) {
      toast.error('Please upload a receipt for this payment method');
      return { success: false };
    }

    try {
      const created = await tripService.addExpense(tripId, {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
        paidThrough: newExpense.paidThrough,
        receiptUrl: newExpense.receiptUrl,
        date: newExpense.date,
      });

      setExpenses((prev) => [created, ...prev]);

      setNewExpense({
        description: '',
        amount: '',
        paidBy: getDefaultPaidBy(trip),
        paidThrough: 'Cash',
        receiptUrl: '',
        date: new Date().toISOString().split('T')[0],
      });

      toast.success('Expense added!');
      return { success: true };
    } catch (err) {
      console.error('addExpense error:', err);
      toast.error(err.message || 'Failed to add expense');
      return { success: false };
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      const updated = await tripService.updateExpense(tripId, expenseId, expenseData);
      setExpenses((prev) =>
        prev.map((e) => (e._id === expenseId ? updated : e))
      );
      toast.success('Expense updated!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update expense');
      return { success: false };
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await tripService.deleteExpense(tripId, expenseId);
      setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
      toast.success('Expense deleted!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense');
      return { success: false };
    }
  };

  return {
    expenses,
    loading,
    newExpense,
    setNewExpense,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};