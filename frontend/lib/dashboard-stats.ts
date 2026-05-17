export interface ExpenseSnapshot {
  amount: number;
  date: string;
}

export interface DashboardStats {
  thisMonthTotal: number;
  monthlyChange: number | null;
  transactionCount: number;
  avgPerTransaction: number;
  dailyAvg: number;
  dailyChange: number | null;
  lastMonthTransactions: number;
}

export function calculateSummaryStats(
  expenses: ExpenseSnapshot[],
  now: Date = new Date()
): DashboardStats {
  const thisMonth = {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = {
    start: new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1),
    end: new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0),
  };

  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= thisMonth.start && expenseDate <= thisMonth.end;
  });

  const lastMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= lastMonth.start && expenseDate <= lastMonth.end;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyChange = lastMonthTotal > 0
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    : null;

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgPerTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const daysInMonth = now.getDate();
  const dailyAvg = daysInMonth > 0 ? thisMonthTotal / daysInMonth : 0;

  const daysLastMonth = lastMonth.end.getDate();
  const lastMonthDailyAvg = daysLastMonth > 0 ? lastMonthTotal / daysLastMonth : 0;
  const dailyChange = lastMonthDailyAvg > 0
    ? ((dailyAvg - lastMonthDailyAvg) / lastMonthDailyAvg) * 100
    : null;

  return {
    thisMonthTotal,
    monthlyChange,
    transactionCount: thisMonthExpenses.length,
    avgPerTransaction,
    dailyAvg,
    dailyChange,
    lastMonthTransactions: lastMonthExpenses.length,
  };
}