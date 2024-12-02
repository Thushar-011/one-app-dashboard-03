import { useState } from "react";
import { useWidgets } from "@/hooks/useWidgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    if (!amount || !date || !selectedCategory) return;

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

    // Reset form
    setAmount("");
    setDescription("");
    setDate(undefined);
    setSelectedCategory("");
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

      <div className="space-y-2">
        <select
          className="w-full p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {data.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  );
}