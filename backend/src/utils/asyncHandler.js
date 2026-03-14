const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("ERROR CAUGHT:", err);
    next(err);
  });
};
export default asyncHandler;
 