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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExpenseCategory } from "@/types/widget";

interface ExpenseFormProps {
  onAddExpense: (expense: {
    description: string;
    amount: string;
    date: Date;
    categoryId: string;
  }) => void;
  onAddCategory: (name: string) => void;
  categories: ExpenseCategory[];
}

export default function ExpenseForm({ onAddExpense, onAddCategory, categories = [] }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!description.trim() || !amount || !selectedDate || !selectedCategory) return;
    
    onAddExpense({
      description: description.trim(),
      amount,
      date: selectedDate,
      categoryId: selectedCategory,
    });

    setDescription("");
    setAmount("");
    setSelectedDate(undefined);
    setSelectedCategory(undefined);
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
                    onAddCategory(input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add category
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {(categories || []).map((category) => (
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
        onClick={handleSubmit}
        disabled={!description.trim() || !amount || !selectedDate || !selectedCategory}
        className="w-full"
      >
        Add Expense
      </Button>
    </div>
  );
}