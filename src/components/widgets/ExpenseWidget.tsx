import { useWidgets } from "@/hooks/useWidgets";
import { ExpenseData } from "@/types/widget";
import { formatIndianCurrency } from "@/lib/utils";
import ExpenseCategories from "./expense/ExpenseCategories";
import ExpenseForm from "./expense/ExpenseForm";
import ExpenseAnalytics from "./expense/ExpenseAnalytics";

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

  const categories = data?.categories || [];
  const expenses = data?.expenses || [];

  const addCategory = (name: string) => {
    const newCategory = {
      id: Date.now().toString(),
      name: name.trim(),
      color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length]
    };

    updateWidget(id, {
      data: {
        categories: [...categories, newCategory],
        expenses
      }
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

  const addExpense = (newExpense: {
    amount: string;
    description: string;
    categoryId: string;
    date: string;
  }) => {
    const expenseItem = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      categoryId: newExpense.categoryId,
      date: newExpense.date
    };

    updateWidget(id, {
      data: {
        categories,
        expenses: [...expenses, expenseItem]
      }
    });
  };

  if (!isDetailView) {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {total === 0
          ? "No expenses recorded"
          : `Total: ${formatIndianCurrency(total)}`}
      </div>
    );
  }

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <ExpenseCategories
        categories={categories}
        onAddCategory={addCategory}
        onRemoveCategory={removeCategory}
      />

      <ExpenseForm
        categories={categories}
        onAddExpense={addExpense}
      />

      <ExpenseAnalytics
        categories={categories}
        expenses={expenses}
      />
    </div>
  );
}