import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

// ── Core Middleware ─────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ──────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Error Handling ──────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;