import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  getMe
} from "../controllers/auth.controllers.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  registerValidator,
  loginValidator
} from "../validators/auth.validator.js";

const router = Router();

// ── Public Routes ─────────────────────────

// Register
router.post(
  "/register",
  registerValidator,
  validate,
  register
);

// Login
router.post(
  "/login",
  loginValidator,
  validate,
  login
);

// Refresh token
router.post("/refresh", refreshToken);

// Logout
router.post("/logout", logout);

// ── Protected Routes ─────────────────────

router.get(
  "/me",
  protect,
  getMe
);

export default router;