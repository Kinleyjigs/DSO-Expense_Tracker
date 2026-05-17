import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { authService } from "../services/auth.service.js";

export class AuthController {
  async register(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: "Registration successful",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.json({
        success: true,
        data: result,
        message: "Login successful",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({
        success: false,
        error: message,
      });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const user = await authService.getProfile(req.user.userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get profile";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

export const authController = new AuthController();
