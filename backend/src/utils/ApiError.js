class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;
 
    Error.captureStackTrace(this, this.constructor);
  }
}
 
export default ApiError;
 