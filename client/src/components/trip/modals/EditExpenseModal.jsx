import React, { useEffect, useState } from 'react';
import { X, Upload, Loader, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../../../utils/CloudinaryUploads';

const PAYMENT_METHODS = ['Cash', 'GCash', 'PayMaya', 'Maribank', 'BPI', 'BDO', 'Other'];
const ONLINE_METHODS = ['GCash', 'PayMaya', 'Maribank', 'BPI', 'BDO', 'Other'];

export const EditExpenseModal = ({ isOpen, onClose, trip, expense, onSave }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    paidThrough: 'Cash',
    receiptUrl: '',
    date: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen && expense) {
      setForm({
        description: expense.description || '',
        amount: expense.amount || '',
        paidBy: expense.paidBy || '',
        paidThrough: expense.paidThrough || 'Cash',
        receiptUrl: expense.receiptUrl || '',
        date: expense.date
          ? new Date(expense.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, expense]);

  if (!isOpen || !expense) return null;

  const needsReceipt = ONLINE_METHODS.includes(form.paidThrough);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'wanderly/receipts');
      setForm({ ...form, receiptUrl: url });
      toast.success('Receipt uploaded!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.description || !form.amount || !form.paidBy) {
      toast.error('Please fill in all fields');
      return;
    }
    if (needsReceipt && !form.receiptUrl) {
      toast.error('Please upload a receipt for this payment method');
      return;
    }
    onSave({
      description: form.description,
      amount: parseFloat(form.amount),
      paidBy: form.paidBy,
      paidThrough: form.paidThrough,
      receiptUrl: form.receiptUrl,
      date: form.date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
        >
          <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">
          Edit Expense
        </h2>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
          Update this expense's details.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Amount (₱)</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Paid By</label>
            <select
              value={form.paidBy}
              onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              {trip.members?.map((m) => (
                <option key={m._id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Paid Through</label>
            <select
              value={form.paidThrough}
              onChange={(e) => setForm({ ...form, paidThrough: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {needsReceipt && (
            <div>
              <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                Receipt (required for {form.paidThrough})
              </label>

              {form.receiptUrl ? (
                <div className="relative border border-[#e8eaed] dark:border-dark-border rounded-lg overflow-hidden">
                  <img
                    src={form.receiptUrl}
                    alt="Receipt"
                    className="w-full h-40 object-contain bg-[#F8F9FA] dark:bg-dark-card/50"
                  />
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20">
                    <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-medium">
                      <Check className="w-3 h-3" /> Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, receiptUrl: '' })}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-[#e8eaed] dark:border-dark-border rounded-lg cursor-pointer hover:bg-terracotta-soft/20 transition-colors">
                  {uploading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin text-terracotta" />
                      <span className="text-sm text-warm-grey dark:text-dark-text-secondary">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-terracotta" />
                      <span className="text-sm text-deep-charcoal dark:text-dark-text font-medium">
                        Click to upload receipt
                      </span>
                      <span className="text-xs text-warm-grey dark:text-dark-text-secondary">PNG, JPG up to 5MB</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading || (needsReceipt && !form.receiptUrl)}
              className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};