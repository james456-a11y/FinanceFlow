import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Minus, PiggyBank } from 'lucide-react';
import { Transaction, TransactionType, FinancialSummary } from './types';
import { SummaryCards } from './components/SummaryCards';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { FinancialChart } from './components/FinancialChart';
import { AIAnalysis } from './components/AIAnalysis';

const App: React.FC = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<TransactionType>('income');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('financeFlowTransactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem('financeFlowTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Derived State: Summary
  const summary: FinancialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses
    };
  }, [transactions]);

  // Handlers
  const openAddModal = (type: TransactionType) => {
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  const handleAddTransaction = (type: TransactionType, amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      type,
      amount,
      description,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <PiggyBank size={28} />
            <h1 className="text-xl font-bold tracking-tight">FinanceFlow</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openAddModal('income')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Income</span>
            </button>
            <button
              onClick={() => openAddModal('expense')}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 text-sm font-medium rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Minus size={16} />
              <span className="hidden sm:inline">Expense</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Financial Overview</h2>
          <SummaryCards summary={summary} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts & AI */}
          <div className="lg:col-span-1 space-y-8">
            <FinancialChart summary={summary} />
            <AIAnalysis summary={summary} transactions={transactions} />
          </div>

          {/* Right Column: Transactions List */}
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        </div>
      </main>

      {/* Floating Add Buttons (Mobile only, or as alternative) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 sm:hidden z-40">
        <button
          onClick={() => openAddModal('income')}
          className="w-12 h-12 bg-emerald-600 rounded-full text-white shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-95"
          aria-label="Add Income"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => openAddModal('expense')}
          className="w-12 h-12 bg-rose-600 rounded-full text-white shadow-lg flex items-center justify-center hover:bg-rose-700 transition-all active:scale-95"
          aria-label="Add Expense"
        >
          <Minus size={24} />
        </button>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        defaultType={modalDefaultType}
      />
    </div>
  );
};

export default App;