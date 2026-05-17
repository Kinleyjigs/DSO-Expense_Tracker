'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { 
  User, 
  Expense, 
  Category, 
  ExpenseStats, 
  ExpenseFilters,
  CreateExpenseData 
} from './api';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.login(email, password);
          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            set({ 
              user: response.data.user, 
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },
      
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await api.register(email, password, name);
          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            set({ 
              user: response.data.user, 
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }
        
        try {
          const response = await api.getProfile();
          if (response.success && response.data) {
            set({ user: response.data, token, isAuthenticated: true });
          } else {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
          }
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// Expense Store
interface ExpenseState {
  expenses: Expense[];
  stats: ExpenseStats | null;
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  filters: ExpenseFilters;
  
  fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
  fetchStats: (startDate?: string, endDate?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addExpense: (data: CreateExpenseData) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<CreateExpenseData>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  setFilters: (filters: ExpenseFilters) => void;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: [],
  stats: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: null,
  filters: {},
  
  fetchExpenses: async (filters?: ExpenseFilters) => {
    set({ isLoading: true, error: null });
    try {
      const appliedFilters = filters || get().filters;
      const response = await api.getExpenses(appliedFilters);
      if (response.success) {
        set({ 
          expenses: response.data || [], 
          pagination: response.pagination || null,
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch expenses',
        isLoading: false 
      });
    }
  },
  
  fetchStats: async (startDate?: string, endDate?: string) => {
    try {
      const response = await api.getExpenseStats(startDate, endDate);
      if (response.success && response.data) {
        set({ stats: response.data });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch stats'
      });
    }
  },
  
  fetchCategories: async () => {
    try {
      const response = await api.getCategories();
      if (response.success && response.data) {
        set({ categories: response.data });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      });
    }
  },
  
  addExpense: async (data: CreateExpenseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createExpense(data);
      if (response.success && response.data) {
        const currentExpenses = get().expenses;
        set({ 
          expenses: [response.data, ...currentExpenses],
          isLoading: false 
        });
        // Refresh stats
        get().fetchStats();
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add expense',
        isLoading: false 
      });
      return false;
    }
  },
  
  updateExpense: async (id: string, data: Partial<CreateExpenseData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateExpense(id, data);
      if (response.success && response.data) {
        const currentExpenses = get().expenses;
        set({ 
          expenses: currentExpenses.map(e => e.id === id ? response.data! : e),
          isLoading: false 
        });
        // Refresh stats
        get().fetchStats();
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update expense',
        isLoading: false 
      });
      return false;
    }
  },
  
  deleteExpense: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.deleteExpense(id);
      if (response.success) {
        const currentExpenses = get().expenses;
        set({ 
          expenses: currentExpenses.filter(e => e.id !== id),
          isLoading: false 
        });
        // Refresh stats
        get().fetchStats();
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete expense',
        isLoading: false 
      });
      return false;
    }
  },
  
  setFilters: (filters: ExpenseFilters) => {
    set({ filters });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));

// Category icons map for UI
export const categoryIcons: Record<string, string> = {
  'utensils': '🍽️',
  'car': '🚗',
  'shopping-bag': '🛍️',
  'film': '🎬',
  'receipt': '📄',
  'heart-pulse': '❤️',
  'plane': '✈️',
  'graduation-cap': '🎓',
  'user': '👤',
  'ellipsis': '•••',
};
