import { useState } from "react";
import { ExpenseData } from "@/types/widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseForm from "./expense/ExpenseForm";
import ExpenseList from "./expense/ExpenseList";
import ExpenseAnalytics from "./expense/ExpenseAnalytics";

interface ExpenseWidgetProps {
  id: string;
  data: ExpenseData;
  isDetailView: boolean;
}

export default function ExpenseWidget({ id, data, isDetailView }: ExpenseWidgetProps) {
  const [activeTab, setActiveTab] = useState<string>("add");

  if (!isDetailView) {
    // Calculate total expenses
    const total = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const recentExpenses = data.expenses.slice(-3); // Get last 3 expenses

    return (
      <div className="h-full flex flex-col gap-2">
        <div className="text-sm font-medium">Total: ₹{total}</div>
        <div className="flex-1 min-h-0">
          <div className="text-sm text-muted-foreground mb-2">Recent Expenses:</div>
          <div className="space-y-1.5">
            {recentExpenses.map((expense) => {
              const category = data.categories.find(c => c.id === expense.categoryId);
              return (
                <div key={expense.id} className="flex justify-between items-center text-sm">
                  <span className="truncate">{category?.name || 'Uncategorized'}</span>
                  <span className="text-muted-foreground">₹{expense.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="add">Add</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="add" className="mt-4">
        <ExpenseForm id={id} data={data} />
      </TabsContent>
      <TabsContent value="list" className="mt-4">
        <ExpenseList expenses={data.expenses} categories={data.categories} />
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <ExpenseAnalytics expenses={data.expenses} categories={data.categories} />
      </TabsContent>
    </Tabs>
  );
}