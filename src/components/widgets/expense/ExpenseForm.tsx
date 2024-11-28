import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpenseCategory } from "@/types/widget";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ExpenseFormProps {
  categories: ExpenseCategory[];
  onAddExpense: (expense: {
    amount: string;
    description: string;
    categoryId: string;
    date: string;
  }) => void;
}

export default function ExpenseForm({ categories, onAddExpense }: ExpenseFormProps) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: format(new Date(), "yyyy-MM-dd")
  });

  const handleSubmit = () => {
    if (!newExpense.amount || !newExpense.categoryId) return;
    
    onAddExpense(newExpense);
    setNewExpense({
      amount: "",
      description: "",
      categoryId: "",
      date: format(new Date(), "yyyy-MM-dd")
    });

    toast("Expense added successfully", {
      position: "top-center",
      duration: 1000,
    });
  };

  return (
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
        <Button onClick={handleSubmit} disabled={!newExpense.amount || !newExpense.categoryId}>
          Add Expense
        </Button>
      </div>
    </div>
  );
}