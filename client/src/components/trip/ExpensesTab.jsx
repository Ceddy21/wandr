import React, { useState } from 'react';
import { Plus, Trash2, DollarSign, Receipt, Pencil, X } from 'lucide-react';
import { ConfirmModal } from './modals/ConfirmModals';
import { EditExpenseModal } from './modals/EditExpenseModal';

function ExpensesTab({
  trip,
  expenses = [],
  totalExpenses,
  perPerson,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;
    await onDeleteExpense(deletingExpense._id);
    setDeletingExpense(null);
  };

  const handleSaveEdit = async (updatedData) => {
    if (!editingExpense) return;
    const result = await onUpdateExpense(editingExpense._id, updatedData);
    if (result?.success) {
      setEditingExpense(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
            Expenses
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-warm-grey dark:text-dark-text-secondary">
            <span>
              Total:{' '}
              <strong className="text-deep-charcoal dark:text-dark-text">
                ₱{totalExpenses?.toLocaleString() || '0'}
              </strong>
            </span>
            <span>
              Per Person:{' '}
              <strong className="text-deep-charcoal dark:text-dark-text">
                ₱{perPerson || '0.00'}
              </strong>
            </span>
          </div>
        </div>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-1 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center text-warm-grey dark:text-dark-text-secondary py-8">
          <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No expenses yet. Track your spending!</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[#e8eaed] dark:border-dark-border">
                <th className="text-left py-2 pr-3 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Paid By
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Method
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Receipt
                </th>
                <th className="text-right py-2 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b border-[#e8eaed] dark:border-dark-border hover:bg-terracotta-soft/10 dark:hover:bg-dark-terracotta-soft/10 transition-colors"
                >
                  <td className="py-2 pr-3 text-deep-charcoal dark:text-dark-text max-w-[200px] truncate">
                    {expense.description}
                  </td>
                  <td className="py-2 pr-3 text-deep-charcoal dark:text-dark-text whitespace-nowrap">
                    ₱{expense.amount?.toLocaleString() || '0'}
                  </td>
                  <td className="py-2 pr-3 text-warm-grey dark:text-dark-text-secondary whitespace-nowrap">
                    {expense.paidBy}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-terracotta-soft/50 dark:bg-dark-terracotta-soft/30 rounded text-xs text-deep-charcoal dark:text-dark-text">
                      {expense.paidThrough || 'Cash'}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-warm-grey dark:text-dark-text-secondary whitespace-nowrap">
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {expense.receiptUrl ? (
                      <button
                        onClick={() => setViewingReceipt(expense)}
                        className="inline-flex items-center gap-1 text-xs text-terracotta dark:text-dark-terracotta hover:underline"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-warm-grey dark:text-dark-text-secondary">
                        —
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="p-1 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 text-terracotta dark:text-dark-terracotta" />
                      </button>
                      <button
                        onClick={() => setDeletingExpense(expense)}
                        className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        trip={trip}
        expense={editingExpense}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        isOpen={!!deletingExpense}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deletingExpense?.description}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingExpense(null)}
      />

      {viewingReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setViewingReceipt(null)}
        >
          <div
            className="bg-white dark:bg-dark-card rounded-2xl max-w-2xl w-full p-4 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-deep-charcoal dark:text-dark-text truncate">
                  Receipt — {viewingReceipt.description}
                </h3>
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">
                  ₱{viewingReceipt.amount?.toLocaleString()} via {viewingReceipt.paidThrough}
                </p>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors flex-shrink-0 ml-3"
              >
                <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
              </button>
            </div>

            <div className="flex-1 overflow-auto mb-3">
              <img
                src={viewingReceipt.receiptUrl}
                alt="Receipt"
                className="w-full h-auto object-contain rounded-lg bg-[#F8F9FA] dark:bg-dark-card/50"
              />
            </div>

            <div className="flex-shrink-0 text-center">
              <a
                href={viewingReceipt.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-terracotta hover:underline inline-block"
              >
                Open in new tab →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesTab;