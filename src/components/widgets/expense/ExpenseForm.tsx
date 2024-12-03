import { useState } from "react";
import { useWidgets } from "@/hooks/useWidgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import CategoryManager from "./CategoryManager";

const CATEGORY_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
  "#D4A5A5", "#9B6B6B", "#E9967A", "#A8E6CF", "#FFB6B9"
];

interface ExpenseFormProps {
  id: string;
  data: {
    categories: Array<{ id: string; name: string; color: string }>;
    expenses: Array<{
      id: string;
      amount: number;
      description: string;
      categoryId: string;
      date: string;
    }>;
  };
}

export default function ExpenseForm({ id, data }: ExpenseFormProps) {
  const { updateWidget } = useWidgets();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !selectedCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      categoryId: selectedCategory,
      date: date.toISOString(),
    };

    updateWidget(id, {
      data: {
        ...data,
        expenses: [...data.expenses, newExpense],
      },
    });

    setAmount("");
    setDescription("");
    setDate(undefined);
    setSelectedCategory("");
    toast.success("Expense added successfully");
  };

  const handleAddCategory = (name: string) => {
    const newCategory = {
      id: Date.now().toString(),
      name,
      color: CATEGORY_COLORS[data.categories.length % CATEGORY_COLORS.length],
    };

    updateWidget(id, {
      data: {
        ...data,
        categories: [...data.categories, newCategory],
      },
    });

    toast.success("Category added successfully");
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if category is in use
    const isInUse = data.expenses.some(expense => expense.categoryId === categoryId);
    if (isInUse) {
      toast.error("Cannot delete category that is in use");
      return;
    }

    updateWidget(id, {
      data: {
        ...data,
        categories: data.categories.filter(cat => cat.id !== categoryId),
      },
    });

    toast.success("Category deleted successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <CategoryManager
        categories={data.categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  );
}