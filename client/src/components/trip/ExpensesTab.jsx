import React from 'react';
import { Plus } from 'lucide-react';

function ExpensesTab({ trip, totalExpenses, perPerson, onAddExpense }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Expenses</h3>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-4 bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Total</p>
          <p className="text-lg font-bold text-deep-charcoal dark:text-dark-text">₱{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Per Person</p>
          <p className="text-lg font-bold text-deep-charcoal dark:text-dark-text">₱{perPerson}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Transactions</p>
          <p className="text-lg font-bold text-deep-charcoal dark:text-dark-text">{trip.expenses.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {trip.expenses.map(expense => (
          <div key={expense.id} className="flex items-center justify-between p-3 border border-[#e8eaed] dark:border-dark-border rounded-lg hover:border-terracotta dark:hover:border-dark-terracotta transition-colors">
            <div>
              <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{expense.description}</p>
              <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Paid by {expense.paidBy} • {expense.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-deep-charcoal dark:text-dark-text">₱{expense.amount}</p>
              <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Split {trip.members.length} ways</p>
            </div>
          </div>
        ))}
        {trip.expenses.length === 0 && (
          <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No expenses added yet.</p>
        )}
      </div>
    </div>
  );
}

export default ExpensesTab;