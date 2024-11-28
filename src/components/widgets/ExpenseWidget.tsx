import { useWidgets } from "@/hooks/useWidgets";
import { ExpenseData, ExpenseCategory, Expense } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Plus, X, BarChart2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const CATEGORY_COLORS = [
  "#8B5CF6", "#06D6A0", "#F97316", "#0EA5E9", "#D946EF",
  "#F59E0B", "#10B981", "#6366F1", "#EC4899", "#14B8A6"
];

interface ExpenseWidgetProps {
  id: string;
  data?: ExpenseData;
  isDetailView: boolean;
}

export default function ExpenseWidget({ id, data, isDetailView }: ExpenseWidgetProps) {
  const { updateWidget } = useWidgets();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: format(new Date(), "yyyy-MM-dd")
  });
  const [analyticsMode, setAnalyticsMode] = useState<'bar' | 'line' | 'text'>('bar');

  const categories = data?.categories || [];
  const expenses = data?.expenses || [];

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const newCategoryItem: ExpenseCategory = {
      id: Date.now().toString(),
      name: newCategory.trim(),
      color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length]
    };

    updateWidget(id, {
      data: {
        categories: [...categories, newCategoryItem],
        expenses
      }
    });

    setNewCategory("");
  };

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.categoryId) return;
    
    const newExpenseItem: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      categoryId: newExpense.categoryId,
      date: newExpense.date
    };

    updateWidget(id, {
      data: {
        categories,
        expenses: [...expenses, newExpenseItem]
      }
    });

    setNewExpense({
      amount: "",
      description: "",
      categoryId: "",
      date: format(new Date(), "yyyy-MM-dd")
    });
  };

  const removeCategory = (categoryId: string) => {
    updateWidget(id, {
      data: {
        categories: categories.filter(cat => cat.id !== categoryId),
        expenses: expenses.filter(exp => exp.categoryId !== categoryId)
      }
    });
  };

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

  if (!isDetailView) {
    const total = getTotalExpenses();
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {total === 0
          ? "No expenses recorded"
          : `Total: $${total.toFixed(2)}`}
      </div>
    );
  }

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Categories</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="flex-1"
                />
                <Button onClick={addCategory}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="widget-list-item flex items-center justify-between p-2 rounded"
              style={{ borderLeft: `4px solid ${category.color}` }}
            >
              <span>{category.name}</span>
              <button
                onClick={() => removeCategory(category.id)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add Expense</h3>
        <div className="grid gap-4">
          <Input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="Amount"
          />
          <Input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder="Description (optional)"
          />
          <select
            value={newExpense.categoryId}
            onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          />
          <Button onClick={addExpense} disabled={!newExpense.amount || !newExpense.categoryId}>
            Add Expense
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Analytics</h3>
          <Button variant="outline" onClick={() => setShowAnalytics(true)}>
            <BarChart2 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {showAnalytics && (
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
                  Total Expenses: ${getTotalExpenses().toFixed(2)}
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
                      <Tooltip />
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
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#8B5CF6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {analyticsMode === 'text' && (
                <div className="space-y-4 mt-4">
                  {getExpensesByCategory().map((category, index) => (
                    <div key={category.name} className="flex justify-between items-center p-4 rounded-lg bg-card">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="font-semibold">${category.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}