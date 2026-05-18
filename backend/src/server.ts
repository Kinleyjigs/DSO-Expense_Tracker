import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://expense-tracker-frontend-y621.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]
  .filter((origin): origin is string => typeof origin === "string")
  .flatMap((origin) => origin.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (same-site requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

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
