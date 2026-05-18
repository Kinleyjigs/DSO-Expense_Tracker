"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseController = exports.ExpenseController = void 0;
const expense_service_js_1 = require("../services/expense.service.js");
class ExpenseController {
    async create(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const expense = await expense_service_js_1.expenseService.create(req.user.userId, req.body);
            res.status(201).json({
                success: true,
                data: expense,
                message: "Expense created successfully",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create expense";
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
            const result = await expense_service_js_1.expenseService.findAll(req.user.userId, req.query);
            res.json({
                success: true,
                data: result.expenses,
                pagination: result.pagination,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch expenses";
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
            const expense = await expense_service_js_1.expenseService.findById(req.user.userId, req.params.id);
            res.json({
                success: true,
                data: expense,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch expense";
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
            const expense = await expense_service_js_1.expenseService.update(req.user.userId, req.params.id, req.body);
            res.json({
                success: true,
                data: expense,
                message: "Expense updated successfully",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update expense";
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
            const result = await expense_service_js_1.expenseService.delete(req.user.userId, req.params.id);
            res.json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete expense";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
    async getStats(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const { startDate, endDate } = req.query;
            const stats = await expense_service_js_1.expenseService.getStats(req.user.userId, startDate, endDate);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch stats";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
}
exports.ExpenseController = ExpenseController;
exports.expenseController = new ExpenseController();
//# sourceMappingURL=expense.controller.js.map