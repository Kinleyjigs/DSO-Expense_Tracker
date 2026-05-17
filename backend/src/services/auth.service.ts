import prisma from "../utils/prisma.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import type { RegisterInput, LoginInput } from "../utils/validators.js";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Create default categories for the user
    await this.createDefaultCategories(user.id);

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  private async createDefaultCategories(userId: string) {
    const defaultCategories = [
      { name: "Food & Dining", icon: "utensils", color: "#ef4444" },
      { name: "Transportation", icon: "car", color: "#f97316" },
      { name: "Shopping", icon: "shopping-bag", color: "#eab308" },
      { name: "Entertainment", icon: "film", color: "#84cc16" },
      { name: "Bills & Utilities", icon: "receipt", color: "#22c55e" },
      { name: "Healthcare", icon: "heart-pulse", color: "#14b8a6" },
      { name: "Travel", icon: "plane", color: "#06b6d4" },
      { name: "Education", icon: "graduation-cap", color: "#3b82f6" },
      { name: "Personal", icon: "user", color: "#8b5cf6" },
      { name: "Other", icon: "ellipsis", color: "#6b7280" },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((cat) => ({
        ...cat,
        userId,
      })),
    });
  }
}

export const authService = new AuthService();
