import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/utils";
import { BarChart2, X } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ExpenseCategory, Expense } from "@/types/widget";
import { format, parseISO } from "date-fns";

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
    // Create a map to store daily totals
    const dailyTotals = new Map<string, number>();

    // Process each expense
    expenses.forEach(exp => {
      const date = exp.date.split('T')[0]; // Get just the date part
      const currentTotal = dailyTotals.get(date) || 0;
      dailyTotals.set(date, currentTotal + exp.amount);
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dailyTotals.entries())
      .map(([date, amount]) => ({
        date,
        amount,
        formattedDate: format(parseISO(date), 'MMM d') // Format date for display
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedData;
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{payload[0].payload.formattedDate}</p>
          <p className="text-sm text-muted-foreground">
            {formatIndianCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

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
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fill: 'currentColor' }}
                    tickLine={{ stroke: 'currentColor' }}
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor' }}
                    tickLine={{ stroke: 'currentColor' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatIndianCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsMode === 'line' && (
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getExpensesByDate()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="formattedDate"
                    tick={{ fill: 'currentColor' }}
                    tickLine={{ stroke: 'currentColor' }}
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor' }}
                    tickLine={{ stroke: 'currentColor' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)", strokeWidth: 2 }}
                  />
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