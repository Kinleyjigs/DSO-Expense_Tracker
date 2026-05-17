import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { categoryService } from "../services/category.service.js";

export class CategoryController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const category = await categoryService.create(req.user.userId, req.body);
      res.status(201).json({
        success: true,
        data: category,
        message: "Category created successfully",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create category";
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

      const categories = await categoryService.findAll(req.user.userId);
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories";
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

      const category = await categoryService.findById(req.user.userId, req.params.id);
      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch category";
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

      const category = await categoryService.update(
        req.user.userId,
        req.params.id,
        req.body
      );
      res.json({
        success: true,
        data: category,
        message: "Category updated successfully",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update category";
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

      const result = await categoryService.delete(req.user.userId, req.params.id);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async getWithStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const categories = await categoryService.getWithStats(req.user.userId);
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

export const categoryController = new CategoryController();
