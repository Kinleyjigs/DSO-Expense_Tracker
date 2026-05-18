"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const expense_routes_js_1 = __importDefault(require("./expense.routes.js"));
const category_routes_js_1 = __importDefault(require("./category.routes.js"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_js_1.default);
router.use("/expenses", expense_routes_js_1.default);
router.use("/categories", category_routes_js_1.default);
// Health check endpoint
router.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map