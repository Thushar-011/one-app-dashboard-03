import { Widget } from "@/types/widget";
import { toast } from "sonner";

export const handleExpenseCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const match = text.match(/expense of (\d+) under (.+)/i);
  if (match) {
    const amount = parseInt(match[1]);
    const category = match[2].trim();

    let expenseWidget = widgets.find(w => w.type === "expense");
    if (!expenseWidget) {
      addWidget("expense", { x: 0, y: 0 });
      expenseWidget = widgets[widgets.length - 1];
    }

    if (expenseWidget) {
      let categoryId = expenseWidget?.data?.categories?.find(
        (c: any) => c.name.toLowerCase() === category.toLowerCase()
      )?.id;

      if (!categoryId) {
        categoryId = Date.now().toString();
        const newCategory = {
          id: categoryId,
          name: category,
          color: "#" + Math.floor(Math.random()*16777215).toString(16),
        };
        expenseWidget.data.categories = [...(expenseWidget?.data?.categories || []), newCategory];
      }

      const newExpense = {
        id: Date.now().toString(),
        amount,
        description: `Voice command: ${amount} under ${category}`,
        categoryId,
        date: new Date().toISOString(),
      };

      const updatedExpenses = [...(expenseWidget?.data?.expenses || []), newExpense];
      updateWidget(expenseWidget.id, {
        data: {
          categories: expenseWidget.data.categories,
          expenses: updatedExpenses,
        }
      });

      toast.success(`Expense of ${amount} added under ${category}`);
    }
  }
};