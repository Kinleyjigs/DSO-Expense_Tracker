'use client';

import { useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  UtensilsCrossed,
  Car,
  Film,
  ShoppingBag,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="h-4 w-4" />,
  Car: <Car className="h-4 w-4" />,
  Film: <Film className="h-4 w-4" />,
  ShoppingBag: <ShoppingBag className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Plane: <Plane className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
  MoreHorizontal: <MoreHorizontal className="h-4 w-4" />,
};

export function RecentExpenses() {
  const expenses = useExpenseStore((state) => state.expenses);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
        <p className="text-sm text-muted-foreground">Your latest transactions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No expenses yet. Add your first expense!
            </p>
          ) : (
            recentExpenses.map((expense) => {
              const category = CATEGORIES.find((c) => c.id === expense.category);
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `color-mix(in oklch, ${category?.color || 'var(--muted)'} 20%, transparent)` }}
                  >
                    <div style={{ color: category?.color }}>
                      {iconMap[category?.icon || 'MoreHorizontal']}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {expense.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category?.name} • {format(new Date(expense.date), 'MMM dd')}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
