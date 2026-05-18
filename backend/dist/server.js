"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_js_1 = require("./middleware/error.js");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ||
        "https://expense-tracker-frontend-pj0r.onrender.com",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use("/api", index_js_1.default);
// Root endpoint
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Expense Tracker API",
        version: "1.0.0",
        docs: "/api/health",
    });
});
// Error handling
app.use(error_js_1.notFoundHandler);
app.use(error_js_1.errorHandler);
function startServer(port = PORT) {
    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Health check: http://localhost:${port}/api/health`);
    });
}
// Only start server if this file is run directly (not imported in tests)
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
    startServer();
}
exports.default = app;
//# sourceMappingURL=server.js.map