const { validationResult } = require("express-validator");
const ValidationError = require("../utils/ValidationError");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ValidationError(errors.array()));
  }
  next();
};
