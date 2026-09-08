import React from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

function ExpensesTab({ trip, totalExpenses, perPerson, onAddExpense }) {
  const expenses = trip?.expenses || [];
  const members = trip?.members || [];

  const handleDeleteExpense = (expenseId) => {
    toast.success('Expense deleted! (API integration coming)');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Expenses</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-warm-grey dark:text-dark-text-secondary">
            <span>Total: <strong className="text-deep-charcoal dark:text-dark-text">₱{totalExpenses?.toLocaleString() || '0'}</strong></span>
            <span>Per Person: <strong className="text-deep-charcoal dark:text-dark-text">₱{perPerson || '0.00'}</strong></span>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8eaed] dark:border-dark-border">
                <th className="text-left py-2 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">Description</th>
                <th className="text-left py-2 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">Amount</th>
                <th className="text-left py-2 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">Paid By</th>
                <th className="text-left py-2 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">Date</th>
                <th className="text-right py-2 text-xs font-medium text-warm-grey dark:text-dark-text-secondary uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id || expense.id} className="border-b border-[#e8eaed] dark:border-dark-border hover:bg-terracotta-soft/10 dark:hover:bg-dark-terracotta-soft/10 transition-colors">
                  <td className="py-2 text-sm text-deep-charcoal dark:text-dark-text">{expense.description}</td>
                  <td className="py-2 text-sm text-deep-charcoal dark:text-dark-text">₱{expense.amount?.toLocaleString() || '0'}</td>
                  <td className="py-2 text-sm text-warm-grey dark:text-dark-text-secondary">{expense.paidBy}</td>
                  <td className="py-2 text-sm text-warm-grey dark:text-dark-text-secondary">
                    {expense.date ? new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDeleteExpense(expense._id || expense.id)}
                      className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpensesTab;