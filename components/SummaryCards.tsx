import React from 'react';
import { FinancialSummary } from '../types';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
          <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalIncome)}</h3>
        </div>
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <TrendingUp size={24} />
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
          <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalExpenses)}</h3>
        </div>
        <div className="p-3 bg-rose-100 rounded-full text-rose-600">
          <TrendingDown size={24} />
        </div>
      </div>

      {/* Savings Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Net Savings</p>
          <h3 className={`text-2xl font-bold ${summary.savings >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            {formatCurrency(summary.savings)}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${summary.savings >= 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
          <Wallet size={24} />
        </div>
      </div>
    </div>
  );
};