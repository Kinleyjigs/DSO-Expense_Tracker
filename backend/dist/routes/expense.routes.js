"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_js_1 = require("../controllers/expense.controller.js");
const validate_js_1 = require("../middleware/validate.js");
const auth_js_1 = require("../middleware/auth.js");
const validators_js_1 = require("../utils/validators.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_js_1.authMiddleware);
// Get expense statistics
router.get("/stats", expense_controller_js_1.expenseController.getStats.bind(expense_controller_js_1.expenseController));
// CRUD operations
router.post("/", (0, validate_js_1.validateBody)(validators_js_1.createExpenseSchema), expense_controller_js_1.expenseController.create.bind(expense_controller_js_1.expenseController));
router.get("/", (0, validate_js_1.validateQuery)(validators_js_1.expenseFilterSchema), expense_controller_js_1.expenseController.findAll.bind(expense_controller_js_1.expenseController));
router.get("/:id", expense_controller_js_1.expenseController.findById.bind(expense_controller_js_1.expenseController));
router.put("/:id", (0, validate_js_1.validateBody)(validators_js_1.updateExpenseSchema), expense_controller_js_1.expenseController.update.bind(expense_controller_js_1.expenseController));
router.delete("/:id", expense_controller_js_1.expenseController.delete.bind(expense_controller_js_1.expenseController));
exports.default = router;
//# sourceMappingURL=expense.routes.js.map