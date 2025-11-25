import { GoogleGenAI } from "@google/genai";
import { Transaction, FinancialSummary } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getFinancialAdvice = async (
  summary: FinancialSummary,
  recentTransactions: Transaction[]
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Format transactions for the prompt (limit to last 5 to save tokens and keep it relevant)
    const transactionList = recentTransactions
      .slice(0, 10)
      .map(t => `- ${t.date.split('T')[0]}: ${t.type.toUpperCase()} $${t.amount} (${t.description})`)
      .join('\n');

    const prompt = `
      You are a helpful financial advisor. Analyze the following monthly financial summary and recent transactions.
      
      Summary:
      - Total Income: $${summary.totalIncome.toFixed(2)}
      - Total Expenses: $${summary.totalExpenses.toFixed(2)}
      - Net Savings: $${summary.savings.toFixed(2)}

      Recent Transactions:
      ${transactionList}

      Please provide 3 specific, actionable, and brief tips (bullet points) to help improve savings or manage expenses better based on this data. 
      Keep the tone encouraging but professional. If savings are negative, prioritize debt/expense reduction advice.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't generate insights right now. Please try again later.";
  }
};