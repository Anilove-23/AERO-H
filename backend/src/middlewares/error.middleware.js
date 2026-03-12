import AppError from "../utils/AppError.js";

// ── 404 handler ───────────────────────────────────────────────────────────────
export const notFound = (req, _res, next) =>
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));

// ── Mongoose cast error (bad ObjectId) ───────────────────────────────────────
const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

// ── Mongoose duplicate key ────────────────────────────────────────────────────
const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`'${err.keyValue[field]}' is already taken`, 409);
};

// ── Mongoose validation error ─────────────────────────────────────────────────
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join(". "), 400);
};

// ── JWT errors ────────────────────────────────────────────────────────────────
const handleJWTError = () =>
  new AppError("Invalid token — please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Token expired — please log in again", 401);

// ── Global error handler ──────────────────────────────────────────────────────
export const errorHandler = (err, req, res, _next) => {
  let error = { ...err, message: err.message };

  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  res.status(statusCode).json({
    status,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};