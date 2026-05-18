"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message,
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (_req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.js.map