class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // gọi constructor của class Error gốc
    this.statusCode = statusCode;
    this.isOperational = true; // đánh dấu đây là lỗi có thể dự đoán
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
