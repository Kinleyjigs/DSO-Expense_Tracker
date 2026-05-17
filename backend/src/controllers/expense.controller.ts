import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { expenseService } from "../services/expense.service.js";

export class ExpenseController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const expense = await expenseService.create(req.user.userId, req.body);
      res.status(201).json({
        success: true,
        data: expense,
        message: "Expense created successfully",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create expense";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await expenseService.findAll(req.user.userId, req.query as any);
      res.json({
        success: true,
        data: result.expenses,
        pagination: result.pagination,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch expenses";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async findById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const expense = await expenseService.findById(req.user.userId, req.params.id);
      res.json({
        success: true,
        data: expense,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch expense";
      res.status(404).json({
        success: false,
        error: message,
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const expense = await expenseService.update(
        req.user.userId,
        req.params.id,
        req.body
      );
      res.json({
        success: true,
        data: expense,
        message: "Expense updated successfully",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update expense";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const result = await expenseService.delete(req.user.userId, req.params.id);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete expense";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { startDate, endDate } = req.query;
      const stats = await expenseService.getStats(
        req.user.userId,
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch stats";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

export const expenseController = new ExpenseController();
