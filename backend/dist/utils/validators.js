"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseFilterSchema = exports.createBudgetSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.updateExpenseSchema = exports.createExpenseSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.createExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Amount must be positive"),
    description: zod_1.z.string().min(1, "Description is required"),
    date: zod_1.z.string().transform((str) => new Date(str)),
    categoryId: zod_1.z.string().min(1, "Category is required"),
});
exports.updateExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Amount must be positive").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    date: zod_1.z
        .string()
        .transform((str) => new Date(str))
        .optional(),
    categoryId: zod_1.z.string().min(1, "Category is required").optional(),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    icon: zod_1.z.string().min(1, "Icon is required"),
    color: zod_1.z.string().min(1, "Color is required"),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").optional(),
    icon: zod_1.z.string().min(1, "Icon is required").optional(),
    color: zod_1.z.string().min(1, "Color is required").optional(),
});
exports.createBudgetSchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Amount must be positive"),
    month: zod_1.z.number().min(1).max(12),
    year: zod_1.z.number().min(2000).max(2100),
    categoryId: zod_1.z.string().min(1, "Category is required"),
});
exports.expenseFilterSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    minAmount: zod_1.z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .optional(),
    maxAmount: zod_1.z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val) || 1)
        .optional(),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val) || 10)
        .optional(),
    sortBy: zod_1.z.enum(["date", "amount", "description"]).optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
});
//# sourceMappingURL=validators.js.map