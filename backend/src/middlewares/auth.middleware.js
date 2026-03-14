import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../models/user.model.js";

/**
 * Protect — verifies the Bearer access token in the Authorization header.
 * Attaches the full user document to req.user on success.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    throw new ApiError("Not authenticated — provide a Bearer token", 401);

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError("Access token invalid or expired", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError("User no longer exists", 401);

  req.user = user;
  next();
});

/**
 * Restrict — limits access to specified roles.
 * Must be used AFTER protect().
 *
 * Usage: router.delete("/user/:id", protect, restrict("admin"), handler)
 */
export const restrict =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError(
          `Role '${req.user.role}' is not allowed to perform this action`,
          403
        )
      );
    next();
  };