import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpenseCategory } from "@/types/widget";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [open, setOpen] = useState(false);
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

  const selectedCategory = categories.find(cat => cat.id === newExpense.categoryId);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add Expense</h3>
        <div className="grid gap-4">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="Amount"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter expense amount</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Description (optional)"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a description for this expense</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCategory?.name || "Select category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            setNewExpense({ ...newExpense, categoryId: category.id });
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category.id === newExpense.categoryId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select expense category</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newExpense.date ? format(new Date(newExpense.date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(newExpense.date)}
                    onSelect={(date) => setNewExpense({ ...newExpense, date: format(date!, "yyyy-MM-dd") })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select expense date</p>
            </TooltipContent>
          </Tooltip>

          <Button 
            onClick={handleSubmit} 
            disabled={!newExpense.amount || !newExpense.categoryId}
          >
            Add Expense
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}