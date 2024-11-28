import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/utils";
import { BarChart2, X } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ExpenseCategory, Expense } from "@/types/widget";

interface ExpenseAnalyticsProps {
  categories: ExpenseCategory[];
  expenses: Expense[];
}

export default function ExpenseAnalytics({ categories, expenses }: ExpenseAnalyticsProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsMode, setAnalyticsMode] = useState<'bar' | 'line' | 'text'>('bar');

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getExpensesByCategory = () => {
    const expensesByCategory = categories.map(category => ({
      name: category.name,
      amount: expenses
        .filter(exp => exp.categoryId === category.id)
        .reduce((sum, exp) => sum + exp.amount, 0),
      color: category.color
    }));

    return expensesByCategory.sort((a, b) => b.amount - a.amount);
  };

  const getExpensesByDate = () => {
    const expensesByDate = expenses.reduce((acc: Record<string, number>, exp) => {
      const date = exp.date.split('T')[0];
      acc[date] = (acc[date] || 0) + exp.amount;
      return acc;
    }, {});

    return Object.entries(expensesByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  if (!showAnalytics) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Analytics</h3>
          <Button variant="outline" onClick={() => setShowAnalytics(true)}>
            <BarChart2 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-0 bg-background overflow-auto animate-in fade-in-0">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4 mb-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold">Expense Analytics</h2>
            <Button variant="ghost" onClick={() => setShowAnalytics(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Total Expenses: {formatIndianCurrency(getTotalExpenses())}
            </h3>
            <div className="flex gap-2">
              <Button
                variant={analyticsMode === 'bar' ? 'default' : 'outline'}
                onClick={() => setAnalyticsMode('bar')}
                size="sm"
              >
                Bar
              </Button>
              <Button
                variant={analyticsMode === 'line' ? 'default' : 'outline'}
                onClick={() => setAnalyticsMode('line')}
                size="sm"
              >
                Line
              </Button>
              <Button
                variant={analyticsMode === 'text' ? 'default' : 'outline'}
                onClick={() => setAnalyticsMode('text')}
                size="sm"
              >
                Text
              </Button>
            </div>
          </div>

          {analyticsMode === 'bar' && (
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getExpensesByCategory()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                  <Bar dataKey="amount" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsMode === 'line' && (
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getExpensesByDate()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                  <Line type="monotone" dataKey="amount" stroke="#8B5CF6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsMode === 'text' && (
            <div className="space-y-4 mt-4">
              {getExpensesByCategory().map((category, index) => (
                <div key={category.name} className="flex justify-between items-center p-4 rounded-lg bg-card border">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-semibold">{formatIndianCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}