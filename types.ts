export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // ISO string
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}