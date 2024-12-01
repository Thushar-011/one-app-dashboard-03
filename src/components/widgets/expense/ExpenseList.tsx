import { format } from "date-fns";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Expense, ExpenseCategory } from "@/types/widget";

interface ExpenseListProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  onRemoveExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, categories, onRemoveExpense }: ExpenseListProps) {
  return (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveExpense(expense.id);
                      }}
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
  );
}