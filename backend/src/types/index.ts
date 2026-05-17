export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Express.Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    total: number;
    count: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    total: number;
    count: number;
  }[];
  dailyTrend: {
    date: string;
    total: number;
    count: number;
  }[];
}
