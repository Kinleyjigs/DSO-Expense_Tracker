import { Router } from "express";
import { expenseController } from "../controllers/expense.controller.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseFilterSchema,
} from "../utils/validators.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get expense statistics
router.get("/stats", expenseController.getStats.bind(expenseController));

// CRUD operations
router.post(
  "/",
  validateBody(createExpenseSchema),
  expenseController.create.bind(expenseController)
);

router.get(
  "/",
  validateQuery(expenseFilterSchema),
  expenseController.findAll.bind(expenseController)
);

router.get("/:id", expenseController.findById.bind(expenseController));

router.put(
  "/:id",
  validateBody(updateExpenseSchema),
  expenseController.update.bind(expenseController)
);

router.delete("/:id", expenseController.delete.bind(expenseController));

export default router;
