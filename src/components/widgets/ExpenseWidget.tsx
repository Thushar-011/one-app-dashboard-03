import { useWidgets } from "@/hooks/useWidgets";
import { ExpenseData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Plus, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseWidgetProps {
  id: string;
  data?: ExpenseData;
  isDetailView: boolean;
}

export default function ExpenseWidget({ id, data, isDetailView }: ExpenseWidgetProps) {
  const { updateWidget } = useWidgets();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [open, setOpen] = useState(false);

  const categories = data?.categories || [];
  const expenses = data?.expenses || [];

  const addExpense = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!description.trim() || !amount || !selectedDate || !selectedCategory) return;
    
    const newExpense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      date: selectedDate.toISOString(),
      categoryId: selectedCategory,
    };

    updateWidget(id, {
      data: {
        categories,
        expenses: [...expenses, newExpense],
      },
    });

    setDescription("");
    setAmount("");
    setSelectedDate(undefined);
    setSelectedCategory(undefined);
  };

  const removeExpense = (e: React.MouseEvent, expenseId: string) => {
    e.stopPropagation();
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
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Select expense date</p>
            </TooltipContent>
          </Tooltip>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCategory
                  ? categories.find((category) => category.id === selectedCategory)?.name
                  : "Select category"}
                <Plus className={cn("ml-2 h-4 w-4 shrink-0 opacity-50", open && "hidden")} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search or add category..." />
                <CommandEmpty>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      const input = document.querySelector<HTMLInputElement>('[cmdk-input]');
                      if (input?.value) {
                        addCategory(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add category
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
                        setSelectedCategory(category.id);
                        setOpen(false);
                      }}
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
            </PopoverContent>
          </Popover>

          <Button 
            onClick={(e) => addExpense(e)}
            disabled={!description.trim() || !amount || !selectedDate || !selectedCategory}
            className="w-full"
          >
            Add Expense
          </Button>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {expenses.map((expense) => {
              const category = categories.find(c => c.id === expense.categoryId);
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between bg-card p-3 rounded-lg border"
                >
                  <div>
                    <p className="text-sm font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(expense.date), "PPP")}
                      </span>
                      {category && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full" 
                          style={{ 
                            backgroundColor: `${category.color}20`,
                            color: category.color 
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">₹{expense.amount.toFixed(2)}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => removeExpense(e, expense.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove expense</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}