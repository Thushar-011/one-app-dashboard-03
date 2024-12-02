import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExpenseFormProps {
  onAddExpense: (expense: {
    description: string;
    amount: string;
    date: Date;
    categoryId: string;
  }) => void;
  onAddCategory: (name: string) => void;
  categories?: Array<{ id: string; name: string; color: string }>;
}

export default function ExpenseForm({
  onAddExpense,
  onAddCategory,
  categories = [],
}: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const handleSubmit = () => {
    if (!description.trim() || !amount || !selectedDate) return;

    // Use the first category as default, or create a default one if none exists
    const defaultCategoryId = categories[0]?.id || 'default';

    onAddExpense({
      description: description.trim(),
      amount,
      date: selectedDate,
      categoryId: defaultCategoryId,
    });

    setDescription("");
    setAmount("");
    setSelectedDate(undefined);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowCategoryDialog(false);
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Expense description"
      />

      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1"
              />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!description.trim() || !amount || !selectedDate}
        className="w-full"
      >
        Add Expense
      </Button>
    </div>
  );
}