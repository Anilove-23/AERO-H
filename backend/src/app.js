import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import ambulanceRoutes from "./routes/ambulance.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import bloodRoutes from "./routes/blood.routes.js";
import simulationRoutes from "./routes/simulation.routes.js";

import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// ─────────────────────────────────────────
// Global Middleware
// ─────────────────────────────────────────

app.use(cors({
origin: process.env.CLIENT_URL,
credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/audio",express.static("public/audio"))

// ─────────────────────────────────────────
// Health Check Route
// ─────────────────────────────────────────

app.get("/health", (_req, res) => {
res.status(200).json({
status: "ok",
message: "API running"
});
});

// ─────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ambulances", ambulanceRoutes);
app.use("/api/v1/emergencies", emergencyRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/blood", bloodRoutes);
app.use("/api/v1/simulation", simulationRoutes);

// Voice Routes
import voiceRoutes from './routes/voice.routes.js'
app.use("/api/v1/voice",voiceRoutes)
// ─────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────

app.use(notFound);

app.use(errorHandler);

export default app;
