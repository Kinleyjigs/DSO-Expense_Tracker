"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const category_service_js_1 = require("../services/category.service.js");
class CategoryController {
    async create(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const category = await category_service_js_1.categoryService.create(req.user.userId, req.body);
            res.status(201).json({
                success: true,
                data: category,
                message: "Category created successfully",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create category";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
    async findAll(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const categories = await category_service_js_1.categoryService.findAll(req.user.userId);
            res.json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch categories";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
    async findById(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const category = await category_service_js_1.categoryService.findById(req.user.userId, req.params.id);
            res.json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch category";
            res.status(404).json({
                success: false,
                error: message,
            });
        }
    }
    async update(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const category = await category_service_js_1.categoryService.update(req.user.userId, req.params.id, req.body);
            res.json({
                success: true,
                data: category,
                message: "Category updated successfully",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update category";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
    async delete(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const result = await category_service_js_1.categoryService.delete(req.user.userId, req.params.id);
            res.json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete category";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
    async getWithStats(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const categories = await category_service_js_1.categoryService.getWithStats(req.user.userId);
            res.json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch categories";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
}
exports.CategoryController = CategoryController;
exports.categoryController = new CategoryController();
//# sourceMappingURL=category.controller.js.map