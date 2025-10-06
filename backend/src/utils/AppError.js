class AppError extends Error {
  constructor(errorCodeOrMessage, statusCode, errorCode) {
    if (typeof errorCodeOrMessage == "object") {
      super(errorCodeOrMessage.message);
      this.statusCode = errorCodeOrMessage.statusCode;
      this.errorCode = errorCodeOrMessage.errorCode;
    } else {
      super(errorCodeOrMessage);
      this.statusCode = statusCode;
      this.errorCode = errorCode;
    }
    this.isOperational = true; // đánh dấu đây là lỗi có thể dự đoán
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
