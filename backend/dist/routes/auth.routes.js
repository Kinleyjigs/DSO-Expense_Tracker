"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_js_1 = require("../middleware/validate.js");
const auth_js_1 = require("../middleware/auth.js");
const validators_js_1 = require("../utils/validators.js");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", (0, validate_js_1.validateBody)(validators_js_1.registerSchema), auth_controller_js_1.authController.register.bind(auth_controller_js_1.authController));
router.post("/login", (0, validate_js_1.validateBody)(validators_js_1.loginSchema), auth_controller_js_1.authController.login.bind(auth_controller_js_1.authController));
// Protected routes
router.get("/profile", auth_js_1.authMiddleware, auth_controller_js_1.authController.getProfile.bind(auth_controller_js_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map