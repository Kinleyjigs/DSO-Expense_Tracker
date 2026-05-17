import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string().transform((str) => new Date(str)),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1, "Description is required").optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  icon: z.string().min(1, "Icon is required").optional(),
  color: z.string().min(1, "Color is required").optional(),
});

export const createBudgetSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  categoryId: z.string().min(1, "Category is required"),
});

export const expenseFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categoryId: z.string().optional(),
  minAmount: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .optional(),
  maxAmount: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .optional(),
  search: z.string().optional(),
  page: z
    .string()
    .transform((val) => parseInt(val) || 1)
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val) || 10)
    .optional(),
  sortBy: z.enum(["date", "amount", "description"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>;
