import prisma from "../utils/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilterInput,
} from "../utils/validators.js";

export class ExpenseService {
  async create(userId: string, data: CreateExpenseInput) {
    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return prisma.expense.create({
      data: {
        amount: data.amount,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(userId: string, filters: ExpenseFilterInput) {
    const {
      startDate,
      endDate,
      categoryId,
      minAmount,
      maxAmount,
      search,
      page = 1,
      limit = 10,
      sortBy = "date",
      sortOrder = "desc",
    } = filters;

    const where: Prisma.ExpenseWhereInput = {
      userId,
      ...(startDate && { date: { gte: new Date(startDate) } }),
      ...(endDate && {
        date: { ...(startDate ? { gte: new Date(startDate) } : {}), lte: new Date(endDate) },
      }),
      ...(categoryId && { categoryId }),
      ...(minAmount && { amount: { gte: minAmount } }),
      ...(maxAmount && {
        amount: { ...(minAmount ? { gte: minAmount } : {}), lte: maxAmount },
      }),
      ...(search && {
        description: { contains: search, mode: "insensitive" as Prisma.QueryMode },
      }),
    };

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, id: string) {
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    return expense;
  }

  async update(userId: string, id: string, data: UpdateExpenseInput) {
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });

      if (!category) {
        throw new Error("Category not found");
      }
    }

    return prisma.expense.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(userId: string, id: string) {
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    await prisma.expense.delete({ where: { id } });
    return { message: "Expense deleted successfully" };
  }

  async getStats(userId: string, startDate?: string, endDate?: string) {
    const where: Prisma.ExpenseWhereInput = {
      userId,
      ...(startDate && { date: { gte: new Date(startDate) } }),
      ...(endDate && {
        date: { ...(startDate ? { gte: new Date(startDate) } : {}), lte: new Date(endDate) },
      }),
    };

    const [expenses, categories] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: "asc" },
      }),
      prisma.category.findMany({ where: { userId } }),
    ]);

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.length;
    const averageAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

    // Category breakdown
    const categoryMap = new Map<string, { total: number; count: number; name: string }>();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { total: 0, count: 0, name: cat.name });
    });

    expenses.forEach((expense) => {
      const cat = categoryMap.get(expense.categoryId);
      if (cat) {
        cat.total += expense.amount;
        cat.count += 1;
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        total: data.total,
        count: data.count,
        percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
      }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.total - a.total);

    // Monthly trend
    const monthlyMap = new Map<string, { total: number; count: number }>();
    expenses.forEach((expense) => {
      const month = expense.date.toISOString().slice(0, 7);
      const existing = monthlyMap.get(month) || { total: 0, count: 0 };
      existing.total += expense.amount;
      existing.count += 1;
      monthlyMap.set(month, existing);
    });

    const monthlyTrend = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Daily trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyMap = new Map<string, { total: number; count: number }>();
    expenses
      .filter((e) => e.date >= thirtyDaysAgo)
      .forEach((expense) => {
        const date = expense.date.toISOString().slice(0, 10);
        const existing = dailyMap.get(date) || { total: 0, count: 0 };
        existing.total += expense.amount;
        existing.count += 1;
        dailyMap.set(date, existing);
      });

    const dailyTrend = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalExpenses,
      totalAmount,
      averageAmount,
      categoryBreakdown,
      monthlyTrend,
      dailyTrend,
    };
  }
}

export const expenseService = new ExpenseService();
