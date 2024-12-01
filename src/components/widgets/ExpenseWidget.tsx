import { useWidgets } from "@/hooks/useWidgets";
import { ExpenseData } from "@/types/widget";
import { TooltipProvider } from "@/components/ui/tooltip";
import ExpenseForm from "./expense/ExpenseForm";
import ExpenseList from "./expense/ExpenseList";

interface ExpenseWidgetProps {
  id: string;
  data?: ExpenseData;
  isDetailView: boolean;
}

export default function ExpenseWidget({ id, data, isDetailView }: ExpenseWidgetProps) {
  const { updateWidget } = useWidgets();
  
  const categories = data?.categories || [];
  const expenses = data?.expenses || [];

  const addExpense = ({ description, amount, date, categoryId }: {
    description: string;
    amount: string;
    date: Date;
    categoryId: string;
  }) => {
    const newExpense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: date.toISOString(),
      categoryId,
    };

    updateWidget(id, {
      data: {
        categories,
        expenses: [...expenses, newExpense],
      },
    });
  };

  const removeExpense = (expenseId: string) => {
    updateWidget(id, {
      data: {
        categories,
        expenses: expenses.filter((expense) => expense.id !== expenseId),
      },
    });
  };

  const addCategory = (categoryName: string) => {
    if (!categoryName.trim()) return;
    
    const newCategory = {
      id: Date.now().toString(),
      name: categoryName.trim(),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };

    updateWidget(id, {
      data: {
        categories: [...categories, newCategory],
        expenses,
      },
    });
  };

  if (!isDetailView) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {totalExpenses === 0
          ? "No expenses recorded"
          : `Total: ₹${totalExpenses.toFixed(2)}`}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ExpenseForm
          onAddExpense={addExpense}
          onAddCategory={addCategory}
          categories={categories}
        />
        <ExpenseList
          expenses={expenses}
          categories={categories}
          onRemoveExpense={removeExpense}
        />
      </div>
    </TooltipProvider>
  );
}