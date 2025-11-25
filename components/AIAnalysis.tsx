import React, { useState } from 'react';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import { FinancialSummary, Transaction } from '../types';
import { getFinancialAdvice } from '../services/gemini';

interface AIAnalysisProps {
  summary: FinancialSummary;
  transactions: Transaction[];
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ summary, transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (transactions.length === 0) {
        setAdvice("Please add some transactions first so I can analyze your data!");
        return;
    }
    setLoading(true);
    const result = await getFinancialAdvice(summary, transactions);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Bot size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold">AI Financial Insights</h3>
        </div>

        {!advice && !loading && (
          <div className="text-indigo-100">
            <p className="mb-4 text-sm leading-relaxed">
              Unlock personalized insights about your spending habits and savings potential powered by Gemini AI.
            </p>
            <button
              onClick={handleGetAdvice}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm text-sm"
            >
              <Sparkles size={16} />
              Analyze My Finances
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-6 text-indigo-100 animate-pulse">
            <Loader2 size={32} className="animate-spin mb-2" />
            <p className="text-sm">Analyzing your data...</p>
          </div>
        )}

        {advice && !loading && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-line font-light tracking-wide">
                {advice}
              </div>
            </div>
            <button 
                onClick={() => setAdvice(null)} 
                className="mt-4 text-xs text-indigo-200 hover:text-white underline"
            >
                Clear Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};