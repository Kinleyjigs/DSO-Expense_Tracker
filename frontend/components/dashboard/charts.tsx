'use client';

import { useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { BarChart3, Sparkles } from 'lucide-react';

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

function EmptyChartState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-secondary/30 to-background/40 px-6 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Waiting for data
          </Badge>
          <BarChart3 className="h-10 w-10 text-muted-foreground/70" />
          <p className="mt-4 text-sm font-medium text-foreground">This section will populate once expenses arrive.</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add a few transactions and the chart will show the real trend instead of an empty canvas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value?.toFixed(2) || '0.00'}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function SpendingTrendChart() {
  const expenses = useExpenseStore((state) => state.expenses);

  if (expenses.length === 0) {
    return <EmptyChartState title="Spending Trend" description="Last 30 days" />;
  }

  const data = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = subMonths(now, 1);
    
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
    
    return days.map((day) => {
      const dayExpenses = expenses.filter((e) => {
        const expenseDate = new Date(e.date);
        return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      
      return {
        date: format(day, 'MMM dd'),
        amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      };
    });
  }, [expenses]);

  return (
    <Card className="bg-card/50 border-border/50 col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Last 30 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
                name="Spent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryPieChart() {
  const expenses = useExpenseStore((state) => state.expenses);

  if (expenses.length === 0) {
    return <EmptyChartState title="By Category" description="This month" />;
  }

  const data = useMemo(() => {
    const now = new Date();
    const thisMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };

    const categoryTotals = expenses
      .filter((e) => isWithinInterval(new Date(e.date), thisMonth))
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([categoryId, value], index) => ({
        name: categoryId,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">By Category</CardTitle>
        <p className="text-sm text-muted-foreground">This month</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col">
          <ResponsiveContainer width="100%" height="60%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-muted-foreground">{item.name}</span>
                  <span className="ml-auto font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonthlyComparisonChart() {
  const expenses = useExpenseStore((state) => state.expenses);

  if (expenses.length === 0) {
    return <EmptyChartState title="Monthly Comparison" description="Last 6 months" />;
  }

  const data = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });
    
    return months.map((month) => {
      const monthInterval = {
        start: startOfMonth(month),
        end: endOfMonth(month),
      };
      
      const monthExpenses = expenses.filter((e) =>
        isWithinInterval(new Date(e.date), monthInterval)
      );
      
      return {
        month: format(month, 'MMM'),
        total: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      };
    });
  }, [expenses]);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">Last 6 months</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
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
              <Bar
                dataKey="total"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
                name="Total"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryTrendChart() {
  const expenses = useExpenseStore((state) => state.expenses);

  if (expenses.length === 0) {
    return <EmptyChartState title="Category Trends" description="Top categories over 3 months" />;
  }

  const data = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = subMonths(now, 2);
    
    const months = eachMonthOfInterval({ start: threeMonthsAgo, end: now });
    
    // Get top 4 categories by total spending
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([cat]) => cat);
    
    return months.map((month) => {
      const monthInterval = {
        start: startOfMonth(month),
        end: endOfMonth(month),
      };
      
      const monthData: Record<string, any> = {
        month: format(month, 'MMM'),
      };
      
      topCategories.forEach((cat) => {
        const catExpenses = expenses.filter(
          (e) =>
            e.category === cat &&
            isWithinInterval(new Date(e.date), monthInterval)
        );
        monthData[cat] = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      });
      
      return monthData;
    });
  }, [expenses]);

  const topCategoryNames = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([cat]) => cat);
  }, [expenses]);

  return (
    <Card className="bg-card/50 border-border/50 col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Top categories over 3 months</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
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
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {topCategoryNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={CHART_COLORS[index]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[index], strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
