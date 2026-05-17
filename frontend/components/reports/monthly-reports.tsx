'use client';

import { useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--success)',
  'var(--primary)',
  'var(--accent)',
  'var(--warning)',
  'var(--muted-foreground)',
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
            {entry.name}: ${entry.value?.toFixed(2) || '0.00'}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function MonthlyReports() {
  const expenses = useExpenseStore((state) => state.expenses);

  const reportData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    const monthlyData = months.map((month) => {
      const monthInterval = {
        start: startOfMonth(month),
        end: endOfMonth(month),
      };

      const monthExpenses = expenses.filter((e) =>
        isWithinInterval(new Date(e.date), monthInterval)
      );

      const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      const count = monthExpenses.length;
      const average = count > 0 ? total / count : 0;

      const byCategory = CATEGORIES.reduce((acc, cat) => {
        acc[cat.id] = monthExpenses
          .filter((e) => e.category === cat.id)
          .reduce((sum, e) => sum + e.amount, 0);
        return acc;
      }, {} as Record<string, number>);

      return {
        month: format(month, 'MMMM yyyy'),
        shortMonth: format(month, 'MMM'),
        total,
        count,
        average,
        byCategory,
        date: month,
      };
    });

    // Calculate trends
    const currentMonth = monthlyData[monthlyData.length - 1];
    const lastMonth = monthlyData[monthlyData.length - 2];

    const totalChange = lastMonth.total > 0
      ? ((currentMonth.total - lastMonth.total) / lastMonth.total) * 100
      : 0;

    const countChange = lastMonth.count > 0
      ? ((currentMonth.count - lastMonth.count) / lastMonth.count) * 100
      : 0;

    // Top categories this month
    const topCategories = Object.entries(currentMonth.byCategory)
      .filter(([_, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([catId, amount]) => ({
        category: CATEGORIES.find((c) => c.id === catId),
        amount,
        percentage: currentMonth.total > 0 ? (amount / currentMonth.total) * 100 : 0,
      }));

    return {
      months: monthlyData,
      currentMonth,
      lastMonth,
      totalChange,
      countChange,
      topCategories,
    };
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.currentMonth.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`flex items-center text-xs font-medium ${reportData.totalChange >= 0 ? 'text-destructive' : 'text-accent'}`}>
                {reportData.totalChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(reportData.totalChange).toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.currentMonth.count}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`flex items-center text-xs font-medium ${reportData.countChange >= 0 ? 'text-destructive' : 'text-accent'}`}>
                {reportData.countChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(reportData.countChange).toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average per Transaction
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.currentMonth.average.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              6-Month Total
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.months.reduce((sum, m) => sum + m.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Across all categories
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Breakdown Bar Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Spending over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.months} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="shortMonth"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories Pie Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Categories This Month</CardTitle>
            <p className="text-sm text-muted-foreground">Where your money went</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.topCategories.map((item, index) => ({
                        name: item.category?.name || 'Unknown',
                        value: item.amount,
                        fill: CHART_COLORS[index % CHART_COLORS.length],
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {reportData.topCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-32 flex flex-col justify-center space-y-2">
                {reportData.topCategories.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="truncate text-muted-foreground flex-1">
                      {item.category?.name}
                    </span>
                    <span className="font-medium">{item.percentage.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Details Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Details</CardTitle>
          <p className="text-sm text-muted-foreground">Month-by-month breakdown</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Month</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Transactions</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Average</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Top Category</th>
                </tr>
              </thead>
              <tbody>
                {reportData.months.slice().reverse().map((month, index) => {
                  const topCat = Object.entries(month.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .find(([_, v]) => v > 0);
                  const topCategory = topCat ? CATEGORIES.find((c) => c.id === topCat[0]) : null;
                  
                  return (
                    <tr key={index} className="border-t border-border/50 hover:bg-secondary/20">
                      <td className="p-3 font-medium">{month.month}</td>
                      <td className="p-3 text-right font-semibold">
                        ${month.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{month.count}</td>
                      <td className="p-3 text-right text-muted-foreground">
                        ${month.average.toFixed(2)}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {topCategory?.name || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
