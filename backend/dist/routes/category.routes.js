"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_js_1 = require("../controllers/category.controller.js");
const validate_js_1 = require("../middleware/validate.js");
const auth_js_1 = require("../middleware/auth.js");
const validators_js_1 = require("../utils/validators.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_js_1.authMiddleware);
// Get categories with stats
router.get("/stats", category_controller_js_1.categoryController.getWithStats.bind(category_controller_js_1.categoryController));
// CRUD operations
router.post("/", (0, validate_js_1.validateBody)(validators_js_1.createCategorySchema), category_controller_js_1.categoryController.create.bind(category_controller_js_1.categoryController));
router.get("/", category_controller_js_1.categoryController.findAll.bind(category_controller_js_1.categoryController));
router.get("/:id", category_controller_js_1.categoryController.findById.bind(category_controller_js_1.categoryController));
router.put("/:id", (0, validate_js_1.validateBody)(validators_js_1.updateCategorySchema), category_controller_js_1.categoryController.update.bind(category_controller_js_1.categoryController));
router.delete("/:id", category_controller_js_1.categoryController.delete.bind(category_controller_js_1.categoryController));
exports.default = router;
//# sourceMappingURL=category.routes.js.map