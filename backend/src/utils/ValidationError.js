const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(errors) {
    super("Invalid data.", 400);
    this.errors = errors; // mảng lỗi validate.js
  }
}

module.exports = ValidationError;
