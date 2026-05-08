export const errorHandler = (err, req, res, next) => {
  if (err.name === "validationError") {
    return res
      .status(err.statusCode)
      .json({ status: "fail", message: err.message, errors: err.errors });
  }
console.error(err.message);
  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
    errors: err.errors,
  });
};
