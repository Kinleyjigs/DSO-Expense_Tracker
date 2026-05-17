import { AuthProvider } from '@/components/auth/auth-provider';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { SpendingTrendChart, CategoryPieChart, MonthlyComparisonChart, CategoryTrendChart } from '@/components/dashboard/charts';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { ExpenseForm } from '@/components/expenses/expense-form';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track and analyze your expenses at a glance
            </p>
          </div>
          <ExpenseForm />
        </div>

        <SummaryCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <SpendingTrendChart />
          <CategoryPieChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyComparisonChart />
          <RecentExpenses />
        </div>

        <CategoryTrendChart />
      </div>
    </AuthProvider>
  );
}
