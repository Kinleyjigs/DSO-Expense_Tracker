import { AuthProvider } from '@/components/auth/auth-provider';
import { MonthlyReports } from '@/components/reports/monthly-reports';

export default function ReportsPage() {
  return (
    <AuthProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Detailed monthly reports and spending analysis
          </p>
        </div>

        <MonthlyReports />
      </div>
    </AuthProvider>
  );
}
