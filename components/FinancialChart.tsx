import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FinancialSummary } from '../types';

interface FinancialChartProps {
  summary: FinancialSummary;
}

const COLORS = {
  income: '#10B981', // Emerald 500
  expense: '#F43F5E', // Rose 500
  savings: '#6366F1', // Indigo 500
  neutral: '#94A3B8', // Slate 400
};

export const FinancialChart: React.FC<FinancialChartProps> = ({ summary }) => {
  const { totalIncome, totalExpenses, savings } = summary;

  // Determine what data to show
  // If we have positive savings, show Expense vs Savings breakdown
  // If we have negative savings (debt), show Income vs Deficit (Overspending)
  let data;
  let title;

  if (totalIncome === 0 && totalExpenses === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col items-center justify-center text-slate-400">
        <p>No data to visualize yet.</p>
      </div>
    );
  }

  if (savings >= 0) {
    title = "Where your money went";
    data = [
      { name: 'Expenses', value: totalExpenses, color: COLORS.expense },
      { name: 'Savings', value: savings, color: COLORS.savings },
    ];
  } else {
    title = "Deficit Overview";
    data = [
      { name: 'Income Covered', value: totalIncome, color: COLORS.income },
      { name: 'Overspending', value: Math.abs(savings), color: COLORS.expense },
    ];
  }

  // Filter out zero values to avoid empty chart segments or rendering issues
  const activeData = data.filter(d => d.value > 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={activeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {activeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};