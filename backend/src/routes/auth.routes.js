import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const router = Router();


// ── Public Routes ─────────────────────────────────────────

// Register new user
router.post(
  "/register",
  registerValidator,
  validate,
  register
);

// Login user
router.post(
  "/login",
  loginValidator,
  validate,
  login
);

// Refresh access token
router.post("/refresh", refreshToken);

// Logout user
router.post("/logout", logout);


// ── Protected Routes ─────────────────────────────────────

// Get current user profile
router.get(
  "/me",
  authenticateUser,
  getMe
);

export default router;