import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ExpenseAnalyticsProps {
  expenses: Array<{
    id: string;
    amount: number;
    description: string;
    categoryId: string;
    date: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

// Complementary colors optimized for data visualization
const CHART_COLORS = [
  '#FF9F40', // Orange
  '#4B77BE', // Blue
  '#FF6B6B', // Red
  '#36A2EB', // Light Blue
  '#FFC233', // Yellow
  '#5D9CEC', // Sky Blue
  '#FF7043', // Deep Orange
  '#4FC3F7', // Bright Blue
  '#FFB74D', // Light Orange
  '#64B5F6'  // Royal Blue
];

export default function ExpenseAnalytics({ expenses, categories }: ExpenseAnalyticsProps) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = categories.find(c => c.id === expense.categoryId);
    if (!category) return acc;
    
    return {
      ...acc,
      [category.id]: (acc[category.id] || 0) + expense.amount
    };
  }, {} as { [key: string]: number });

  const data = categories.map((category, index) => ({
    name: category.name,
    value: categoryTotals[category.id] || 0,
    color: CHART_COLORS[index % CHART_COLORS.length]
  })).filter(item => item.value > 0);

  const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Total Expenses</h3>
        <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
      </div>

      <div className="h-[200px]">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="space-y-1 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </div>
            <span>₹{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <ChartTooltipContent>
      <div className="flex flex-col gap-2">
        <div className="font-medium">{payload[0].name}</div>
        <div>₹{payload[0].value.toLocaleString()}</div>
      </div>
    </ChartTooltipContent>
  );
}