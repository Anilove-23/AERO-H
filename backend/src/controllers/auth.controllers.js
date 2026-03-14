import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


// ── Register ─────────────────────────────────────────
export const register = asyncHandler(async (req, res,next) => {

  const { name, email, password ,role} = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError("Email already in use", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    status: "success",
    accessToken,
    user: user.toPublicJSON()
  });

});


// ── Login ─────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    status: "success",
    accessToken,
    user: user.toPublicJSON()
  });

});


// ── Refresh Token ─────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {

  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError("Refresh token missing", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError("Invalid or expired refresh token", 403);
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new ApiError("Refresh token revoked", 403);
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken
  });

});


// ── Logout ─────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {

  const token = req.cookies?.refreshToken;

  if (token) {
    await User.findOneAndUpdate(
      { refreshToken: token },
      { $unset: { refreshToken: "" } }
    );
  }

  res.clearCookie("refreshToken");

  res.status(200).json({
    status: "success",
    message: "Logged out successfully"
  });

});


// ── Get Current User ─────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {

  res.status(200).json({
    status: "success",
    user: req.user.toPublicJSON()
  });

});