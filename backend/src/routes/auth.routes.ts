import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../utils/validators.js";

const router = Router();

// Public routes
router.post(
  "/register",
  validateBody(registerSchema),
  authController.register.bind(authController)
);

router.post(
  "/login",
  validateBody(loginSchema),
  authController.login.bind(authController)
);

// Protected routes
router.get(
  "/profile",
  authMiddleware,
  authController.getProfile.bind(authController)
);

export default router;
