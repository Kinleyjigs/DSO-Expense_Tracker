import prisma from "../utils/prisma.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../utils/validators.js";

export class CategoryService {
  async create(userId: string, data: CreateCategoryInput) {
    const existing = await prisma.category.findFirst({
      where: { name: data.name, userId },
    });

    if (existing) {
      throw new Error("Category with this name already exists");
    }

    return prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findById(userId: string, id: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async update(userId: string, id: string, data: UpdateCategoryInput) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (data.name) {
      const existing = await prisma.category.findFirst({
        where: { name: data.name, userId, NOT: { id } },
      });

      if (existing) {
        throw new Error("Category with this name already exists");
      }
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Check if category has expenses
    const expenseCount = await prisma.expense.count({
      where: { categoryId: id },
    });

    if (expenseCount > 0) {
      throw new Error(
        `Cannot delete category with ${expenseCount} expenses. Delete or reassign expenses first.`
      );
    }

    await prisma.category.delete({ where: { id } });
    return { message: "Category deleted successfully" };
  }

  async getWithStats(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { expenses: true },
        },
        expenses: {
          select: { amount: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      expenseCount: cat._count.expenses,
      totalAmount: cat.expenses.reduce((sum, e) => sum + e.amount, 0),
    }));
  }
}

export const categoryService = new CategoryService();
