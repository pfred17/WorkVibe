const ValidationError = require("../utils/ValidationError");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Nếu lỗi có statusCode (AppError) thì dùng, không thì mặc định 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      errors: err.errors.map((e) => ({
        field: e.param,
        message: e.msg,
      })),
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    // chỉ show stack trace khi đang ở development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
