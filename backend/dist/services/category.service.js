"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
class CategoryService {
    async create(userId, data) {
        const existing = await prisma_js_1.default.category.findFirst({
            where: { name: data.name, userId },
        });
        if (existing) {
            throw new Error("Category with this name already exists");
        }
        return prisma_js_1.default.category.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    async findAll(userId) {
        return prisma_js_1.default.category.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }
    async findById(userId, id) {
        const category = await prisma_js_1.default.category.findFirst({
            where: { id, userId },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }
    async update(userId, id, data) {
        const category = await prisma_js_1.default.category.findFirst({
            where: { id, userId },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        if (data.name) {
            const existing = await prisma_js_1.default.category.findFirst({
                where: { name: data.name, userId, NOT: { id } },
            });
            if (existing) {
                throw new Error("Category with this name already exists");
            }
        }
        return prisma_js_1.default.category.update({
            where: { id },
            data,
        });
    }
    async delete(userId, id) {
        const category = await prisma_js_1.default.category.findFirst({
            where: { id, userId },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        // Check if category has expenses
        const expenseCount = await prisma_js_1.default.expense.count({
            where: { categoryId: id },
        });
        if (expenseCount > 0) {
            throw new Error(`Cannot delete category with ${expenseCount} expenses. Delete or reassign expenses first.`);
        }
        await prisma_js_1.default.category.delete({ where: { id } });
        return { message: "Category deleted successfully" };
    }
    async getWithStats(userId) {
        const categories = await prisma_js_1.default.category.findMany({
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
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=category.service.js.map