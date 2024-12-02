import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseCategory } from "@/types/widget";

interface ExpenseFormProps {
  onAddExpense: (expense: {
    description: string;
    amount: string;
    date: Date;
    categoryId: string;
  }) => void;
  onAddCategory: (name: string) => void;
  categories?: ExpenseCategory[];
}

export default function ExpenseForm({
  onAddExpense,
  onAddCategory,
  categories = [], // Provide default empty array
}: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const handleSubmit = () => {
    if (!description.trim() || !amount || !selectedDate) return;

    // Use first category as default if none selected
    const categoryId = selectedCategory || (categories.length > 0 ? categories[0].id : "default");

    onAddExpense({
      description: description.trim(),
      amount,
      date: selectedDate,
      categoryId,
    });

    setDescription("");
    setAmount("");
    setSelectedDate(new Date());
    setSelectedCategory(undefined);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowCategoryDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="flex-1"
        />
        
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

      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Expense description"
      />

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Command className="w-[200px] border rounded-md">
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No categories found</CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => setSelectedCategory(category.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCategory === category.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
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