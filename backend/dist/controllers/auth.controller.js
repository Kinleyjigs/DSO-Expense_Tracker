"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
class AuthController {
    async register(req, res) {
        try {
            const result = await auth_service_js_1.authService.register(req.body);
            res.status(201).json({
                success: true,
                data: result,
                message: "Registration successful",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
    async login(req, res) {
        try {
            const result = await auth_service_js_1.authService.login(req.body);
            res.json({
                success: true,
                data: result,
                message: "Login successful",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Login failed";
            res.status(401).json({
                success: false,
                error: message,
            });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: "Unauthorized" });
                return;
            }
            const user = await auth_service_js_1.authService.getProfile(req.user.userId);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to get profile";
            res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map