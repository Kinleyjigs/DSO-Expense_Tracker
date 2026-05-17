'use client';

import { useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

interface SummaryCardProps {
  title: string;
  value: string;
  change: number | null;
  icon: React.ReactNode;
  subtitle?: string;
}

function SummaryCard({ title, value, change, icon, subtitle }: SummaryCardProps) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {change !== null && (
            <span
              className={`flex items-center text-xs font-medium ${
                change >= 0 ? 'text-destructive' : 'text-accent'
              }`}
            >
              {change >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const expenses = useExpenseStore((state) => state.expenses);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };

    const thisMonthExpenses = expenses.filter((e) =>
      isWithinInterval(new Date(e.date), thisMonth)
    );
    const lastMonthExpenses = expenses.filter((e) =>
      isWithinInterval(new Date(e.date), lastMonth)
    );

    const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const monthlyChange = lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : null;

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgPerTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    // Daily average this month
    const daysInMonth = now.getDate();
    const dailyAvg = daysInMonth > 0 ? thisMonthTotal / daysInMonth : 0;

    // Last month daily average for comparison
    const daysLastMonth = new Date(lastMonth.end).getDate();
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
  }, [expenses]);

  const transactionChange = stats.lastMonthTransactions > 0
    ? ((stats.transactionCount - stats.lastMonthTransactions) / stats.lastMonthTransactions) * 100
    : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="This Month"
        value={`$${stats.thisMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        change={stats.monthlyChange}
        icon={<DollarSign className="h-4 w-4" />}
        subtitle="vs last month"
      />
      <SummaryCard
        title="Transactions"
        value={stats.transactionCount.toString()}
        change={transactionChange}
        icon={<Receipt className="h-4 w-4" />}
        subtitle="this month"
      />
      <SummaryCard
        title="Daily Average"
        value={`$${stats.dailyAvg.toFixed(2)}`}
        change={stats.dailyChange}
        icon={<Calendar className="h-4 w-4" />}
        subtitle="this month"
      />
      <SummaryCard
        title="Avg per Transaction"
        value={`$${stats.avgPerTransaction.toFixed(2)}`}
        change={null}
        icon={<TrendingUp className="h-4 w-4" />}
        subtitle="all time"
      />
    </div>
  );
}
