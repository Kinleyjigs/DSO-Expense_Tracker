'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useExpenseStore } from '@/lib/store';
import { AuthForm } from '@/components/auth/auth-form';
import { Header } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { fetchExpenses, fetchStats, fetchCategories } = useExpenseStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verifyAuth();
  }, [checkAuth]);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isChecking) {
      fetchExpenses();
      fetchStats();
      fetchCategories();
    }
  }, [isAuthenticated, isChecking, fetchExpenses, fetchStats, fetchCategories]);

  if (!isHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
