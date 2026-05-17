import { Router } from "express";
import authRoutes from "./auth.routes.js";
import expenseRoutes from "./expense.routes.js";
import categoryRoutes from "./category.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/categories", categoryRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
