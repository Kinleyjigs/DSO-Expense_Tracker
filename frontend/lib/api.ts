const API_BASE_URL = (() => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") return `${window.location.origin}/api`;
  return "http://localhost:5000/api";
})();

interface ApiOptions extends RequestInit {
  token?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { token, ...fetchOptions } = options;
    const authToken = token || this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...fetchOptions.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "An error occurred");
    }

    return data;
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    return this.request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request<User>("/auth/profile");
  }

  // Expense endpoints
  async getExpenses(params?: ExpenseFilters) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<Expense[]>(`/expenses${query ? `?${query}` : ""}`);
  }

  async getExpense(id: string) {
    return this.request<Expense>(`/expenses/${id}`);
  }

  async createExpense(data: CreateExpenseData) {
    return this.request<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateExpense(id: string, data: Partial<CreateExpenseData>) {
    return this.request<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string) {
    return this.request<void>(`/expenses/${id}`, {
      method: "DELETE",
    });
  }

  async getExpenseStats(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const query = params.toString();
    return this.request<ExpenseStats>(`/expenses/stats${query ? `?${query}` : ""}`);
  }

  // Category endpoints
  async getCategories() {
    return this.request<Category[]>("/categories");
  }

  async getCategoriesWithStats() {
    return this.request<CategoryWithStats[]>("/categories/stats");
  }

  async createCategory(data: CreateCategoryData) {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Partial<CreateCategoryData>) {
    return this.request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, {
      method: "DELETE",
    });
  }
}

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithStats extends Category {
  expenseCount: number;
  totalAmount: number;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface CreateExpenseData {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

export interface CreateCategoryData {
  name: string;
  icon: string;
  color: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "date" | "amount" | "description";
  sortOrder?: "asc" | "desc";
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

export const api = new ApiClient(API_BASE_URL);
export default api;
