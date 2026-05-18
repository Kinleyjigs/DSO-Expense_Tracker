"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_js_1 = require("../utils/auth.js");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                error: "No token provided",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, auth_js_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: "Invalid or expired token",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map