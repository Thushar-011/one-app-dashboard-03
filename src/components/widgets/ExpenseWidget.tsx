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
    const total = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {data.expenses.length === 0 
          ? "No expenses"
          : `Total Expense: ₹${total.toLocaleString()}`}
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
        <ExpenseList id={id} expenses={data.expenses} categories={data.categories} />
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <ExpenseAnalytics expenses={data.expenses} categories={data.categories} />
      </TabsContent>
    </Tabs>
  );
}