import { ExpenseCategory, Expense } from "@/types/widget";
import { formatIndianCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface ExpenseAnalyticsPanesProps {
  categories: ExpenseCategory[];
  expenses: Expense[];
  currentPane: number;
}

export default function ExpenseAnalyticsPanes({ categories, expenses, currentPane }: ExpenseAnalyticsPanesProps) {
  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategoryData = () => {
    return categories.map(category => ({
      name: category.name,
      value: expenses
        .filter(exp => exp.categoryId === category.id)
        .reduce((sum, exp) => sum + exp.amount, 0),
      color: category.color
    })).filter(cat => cat.value > 0);
  };

  const getMonthlyData = () => {
    const lastSixMonths = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfMonth(new Date())
    });

    return lastSixMonths.map(month => {
      const monthExpenses = expenses.filter(exp => {
        const expDate = parseISO(exp.date);
        return expDate >= startOfMonth(month) && expDate <= endOfMonth(month);
      });

      const categoryAmounts = categories.reduce((acc, cat) => ({
        ...acc,
        [cat.name]: monthExpenses
          .filter(exp => exp.categoryId === cat.id)
          .reduce((sum, exp) => sum + exp.amount, 0)
      }), {});

      return {
        month: format(month, 'MMM yy'),
        ...categoryAmounts
      };
    });
  };

  const getSpendingInsights = () => {
    const categoryTotals = getCategoryData();
    const totalExpense = getTotalExpenses();
    const highestCategory = categoryTotals.reduce((prev, current) => 
      prev.value > current.value ? prev : current
    );

    const insights = [
      {
        title: "Highest Spending Category",
        content: `${highestCategory.name} (${formatIndianCurrency(highestCategory.value)}, ${((highestCategory.value / totalExpense) * 100).toFixed(1)}% of total)`
      },
      {
        title: "Monthly Average",
        content: formatIndianCurrency(totalExpense / 6)
      }
    ];

    return insights;
  };

  const renderPane = () => {
    switch (currentPane) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold">Total Expenses</h3>
              <p className="text-3xl font-bold text-primary">
                {formatIndianCurrency(getTotalExpenses())}
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => formatIndianCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Monthly Expenses</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMonthlyData()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => formatIndianCurrency(value)}
                  />
                  <Legend />
                  {categories.map((category, index) => (
                    <Line
                      key={category.id}
                      type="monotone"
                      dataKey={category.name}
                      stroke={category.color}
                      strokeWidth={2}
                      dot={{ fill: category.color }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Spending Insights</h3>
            <div className="space-y-4">
              {getSpendingInsights().map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium text-muted-foreground">{insight.title}</h4>
                  <p className="mt-1 text-lg">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[400px]">
      {renderPane()}
    </div>
  );
}