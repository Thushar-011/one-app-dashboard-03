import { Button } from "@/components/ui/button";
import { useWidgets } from "@/hooks/useWidgets";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExpenseTableHeader } from "./ExpenseTableHeader";
import { ExpenseTableRow } from "./ExpenseTableRow";

interface ExpenseListProps {
  id: string;
  expenses: Array<{
    id: string;
    amount: number;
    description: string;
    categoryId: string;
    date: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  isCompact?: boolean;
}

export default function ExpenseList({ id, expenses, categories, isCompact = false }: ExpenseListProps) {
  const [editMode, setEditMode] = useState(false);
  const [editingAmount, setEditingAmount] = useState<{ [key: string]: string }>({});
  const { updateWidget } = useWidgets();

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const handleSave = () => {
    const updatedExpenses = expenses.map(expense => ({
      ...expense,
      amount: editingAmount[expense.id] ? parseFloat(editingAmount[expense.id]) : expense.amount
    }));

    updateWidget(id, {
      data: {
        categories,
        expenses: updatedExpenses
      }
    });

    setEditMode(false);
    setEditingAmount({});
    toast("Changes saved successfully");
  };

  const handleDelete = (expenseId: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    updateWidget(id, {
      data: {
        categories,
        expenses: updatedExpenses
      }
    });
    toast("Expense deleted successfully");
  };

  if (isCompact) {
    return (
      <div className="space-y-2">
        {expenses.slice(0, 3).map((expense) => (
          <div key={expense.id} className="flex justify-between items-center text-sm">
            <span>{getCategoryName(expense.categoryId)}</span>
            <span>₹{expense.amount}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (editMode) {
              handleSave();
            } else {
              setEditMode(true);
              const currentAmounts: { [key: string]: string } = {};
              expenses.forEach(expense => {
                currentAmounts[expense.id] = expense.amount.toString();
              });
              setEditingAmount(currentAmounts);
            }
          }}
        >
          {editMode ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <ExpenseTableHeader editMode={editMode} />
            <tbody>
              {expenses.map((expense) => (
                <ExpenseTableRow
                  key={expense.id}
                  expense={expense}
                  editMode={editMode}
                  editingAmount={editingAmount}
                  getCategoryName={getCategoryName}
                  setEditingAmount={setEditingAmount}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}