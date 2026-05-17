import { AuthProvider } from '@/components/auth/auth-provider';
import { ExpenseList } from '@/components/expenses/expense-list';
import { ExpenseFilters } from '@/components/expenses/expense-filters';

export default function ExpensesPage() {
  return (
    <AuthProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all your expenses in one place
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ExpenseFilters />
          </div>
          <div className="lg:col-span-3">
            <ExpenseList />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
