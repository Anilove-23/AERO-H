import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from "../utils/jwt.utils.js";

// ── Register ──────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already in use", 409);

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Persist hashed refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    status: "success",
    accessToken,
    user: user.toPublicJSON(),
  });
});

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError("Email and password are required", 400);

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(password)))
    throw new AppError("Invalid email or password", 401);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: "success",
    accessToken,
    user: user.toPublicJSON(),
  });
});

// ── Refresh Access Token ──────────────────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("Refresh token missing", 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid or expired refresh token", 403);
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token)
    throw new AppError("Refresh token revoked", 403);

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setRefreshCookie(res, newRefreshToken);

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    // Revoke stored token (best-effort — don't throw if user not found)
    await User.findOneAndUpdate(
      { refreshToken: token },
      { $unset: { refreshToken: "" } }
    );
  }

  clearRefreshCookie(res);

  res.status(200).json({ status: "success", message: "Logged out" });
});

// ── Get Me ────────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "success",
    user: req.user.toPublicJSON(),
  });
});