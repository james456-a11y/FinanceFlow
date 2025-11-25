import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedTransactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center py-12 text-slate-400">
        <p>No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Recent History</h3>
      </div>
      <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
        {sortedTransactions.map((t) => (
          <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-900">{t.description}</p>
                <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
              <button 
                onClick={() => onDelete(t.id)}
                className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete transaction"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};