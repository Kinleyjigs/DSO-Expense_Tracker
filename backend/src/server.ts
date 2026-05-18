import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// List of allowed origins - be explicit
const allowedOrigins = [
  "https://expense-tracker-frontend-y621.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// If FRONTEND_URL env var is set, add it
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log("[CORS] Allowed origins:", allowedOrigins);

// Simple, bulletproof CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log(`[CORS] Request origin: ${origin}`);
    
    // Always allow if no origin (same-site requests, mobile apps, etc.)
    if (!origin) {
      console.log("[CORS] No origin header, allowing");
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] Origin ${origin} is allowed`);
      return callback(null, true);
    }
    
    console.warn(`[CORS] Origin ${origin} is NOT allowed`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count", "Content-Type"],
  maxAge: 3600,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for preflight
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", routes);

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
app.use(notFoundHandler);
app.use(errorHandler);

export function startServer(port: string | number = PORT) {
  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });
}

// Only start server if this file is run directly (not imported in tests)
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export default app;
