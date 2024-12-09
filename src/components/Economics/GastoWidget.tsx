import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, Plus, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface GastoWidgetProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onRemoveExpense: (id: string) => void;
  categories: string[];
}

const GastoWidget: React.FC<GastoWidgetProps> = ({
  expenses,
  onAddExpense,
  onRemoveExpense,
  categories,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: categories[0] || '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter(expense => expense.category === selectedCategory);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.description && newExpense.amount) {
      onAddExpense({
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      });
      setNewExpense({
        description: '',
        amount: '',
        category: categories[0] || '',
        date: new Date().toISOString().split('T')[0],
      });
      setIsAddingExpense(false);
    }
  };

  const baseClasses = {
    container: `relative p-6 h-full flex flex-col rounded-xl shadow-lg transition-all duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-red-50 to-red-100 text-gray-800'
    }`,
    header: `flex items-center justify-between mb-6`,
    title: `text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`,
    iconContainer: `${isDark ? 'bg-gray-700' : 'bg-white'} p-2.5 rounded-full shadow-md`,
    icon: `w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-500'}`,
    totalAmount: `text-3xl font-bold tracking-tight ${
      isDark ? 'text-gray-100' : 'text-gray-900'
    }`,
    expensesList: `space-y-3 flex-grow overflow-auto`,
    expenseItem: `flex items-center justify-between p-3 rounded-lg ${
      isDark ? 'bg-gray-800/50' : 'bg-white'
    } shadow transition-all duration-200 hover:shadow-md`,
    addButton: `mt-4 flex items-center justify-center w-full p-3 rounded-lg transition-all duration-200 ${
      isDark
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
        : 'bg-white hover:bg-red-50 text-gray-700 hover:text-red-600'
    }`,
    modal: `fixed inset-0 flex items-center justify-center z-50 ${
      isDark ? 'bg-black/50' : 'bg-gray-600/50'
    }`,
    modalContent: `w-full max-w-md p-6 rounded-xl shadow-xl ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`,
    input: `w-full p-2 rounded-lg mb-4 ${
      isDark
        ? 'bg-gray-700 text-white border-gray-600'
        : 'bg-white text-gray-900 border-gray-200'
    } border focus:ring-2 focus:ring-red-500/20`,
    select: `w-full p-2 rounded-lg mb-4 ${
      isDark
        ? 'bg-gray-700 text-white border-gray-600'
        : 'bg-white text-gray-900 border-gray-200'
    } border focus:ring-2 focus:ring-red-500/20`,
    submitButton: `w-full p-3 rounded-lg ${
      isDark
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-red-500 hover:bg-red-600 text-white'
    }`,
  };

  return (
    <div className={baseClasses.container}>
      <div className={baseClasses.header}>
        <div>
          <h3 className={baseClasses.title}>Gastos</h3>
          <div className={`flex items-center gap-2 mt-2`}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`text-sm rounded-lg ${
                isDark
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-700 border-gray-200'
              } border px-3 py-1.5`}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
        <div className={baseClasses.iconContainer}>
          <DollarSign className={baseClasses.icon} />
        </div>
      </div>

      <div className={baseClasses.totalAmount}>
        {totalAmount.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })}
      </div>

      <div className={baseClasses.expensesList}>
        <AnimatePresence>
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={baseClasses.expenseItem}
            >
              <div>
                <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {expense.description}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {expense.amount.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className={`p-1 rounded-full transition-colors ${
                    isDark
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIsAddingExpense(true)}
        className={baseClasses.addButton}
      >
        <Plus className="w-5 h-5 mr-2" />
        Añadir Gasto
      </button>

      {isAddingExpense && (
        <div className={baseClasses.modal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={baseClasses.modalContent}
          >
            <form onSubmit={handleAddExpense}>
              <input
                type="text"
                placeholder="Descripción"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className={baseClasses.input}
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className={baseClasses.input}
                required
                step="0.01"
                min="0"
              />
              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className={baseClasses.select}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className={baseClasses.input}
                required
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className={`flex-1 p-3 rounded-lg ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancelar
                </button>
                <button type="submit" className={`flex-1 ${baseClasses.submitButton}`}>
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GastoWidget;
