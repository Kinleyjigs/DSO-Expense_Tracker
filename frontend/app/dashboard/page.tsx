import { AuthProvider } from '@/components/auth/auth-provider';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { SpendingTrendChart, CategoryPieChart, MonthlyComparisonChart, CategoryTrendChart } from '@/components/dashboard/charts';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { Badge } from '@/components/ui/badge';
import { BarChart3, ShieldCheck, Sparkles, Wallet } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.16),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.92))] px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:72px_72px] opacity-10" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge className="rounded-full border-white/15 bg-white/10 px-4 py-2 text-white">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
                Live dashboard
              </Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                  See your spending story without digging through raw tables.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                  This view is still powered by backend data, but the layout now gives you a clear first look at trends, category mix, and recent activity as soon as the API returns.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <Wallet className="h-4 w-4 text-cyan-300" />
                  Quick expense entry
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <BarChart3 className="h-4 w-4 text-emerald-300" />
                  Trend and category views
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-amber-300" />
                  Private to your account
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[26rem] lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Status</p>
                <p className="mt-2 text-lg font-medium text-white">Ready to sync</p>
                <p className="mt-1 text-sm text-white/60">Auth-protected and loaded from the backend.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Focus</p>
                <p className="mt-2 text-lg font-medium text-white">Budget movement</p>
                <p className="mt-1 text-sm text-white/60">Monthly totals, daily pace, and category mix.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm lg:hidden">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Action</p>
                <p className="mt-2 text-lg font-medium text-white">Add an expense</p>
                <p className="mt-1 text-sm text-white/60">Use the quick form to log a new transaction.</p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex justify-end lg:-mt-10 lg:justify-start">
            <ExpenseForm />
          </div>
        </section>

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
