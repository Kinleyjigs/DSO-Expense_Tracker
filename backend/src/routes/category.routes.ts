import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { validateBody } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../utils/validators.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get categories with stats
router.get("/stats", categoryController.getWithStats.bind(categoryController));

// CRUD operations
router.post(
  "/",
  validateBody(createCategorySchema),
  categoryController.create.bind(categoryController)
);

router.get("/", categoryController.findAll.bind(categoryController));

router.get("/:id", categoryController.findById.bind(categoryController));

router.put(
  "/:id",
  validateBody(updateCategorySchema),
  categoryController.update.bind(categoryController)
);

router.delete("/:id", categoryController.delete.bind(categoryController));

export default router;
