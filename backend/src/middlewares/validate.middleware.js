import AppError from "../utils/AppError.js";

/**
 * Lightweight field-presence validator.
 * Pass the required field names; it throws a 400 if any are missing/empty.
 *
 * Usage: router.post("/register", validate("name","email","password"), handler)
 */
export const validate =
  (...fields) =>
  (req, _res, next) => {
    const missing = fields.filter(
      (f) => req.body[f] === undefined || req.body[f] === ""
    );

    if (missing.length)
      return next(
        new AppError(`Missing required fields: ${missing.join(", ")}`, 400)
      );

    next();
  };