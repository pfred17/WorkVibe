const jwt = require("jsonwebtoken");

const UserSchema = require("../models/User");
const AppError = require("../utils/AppError");
const ERROR_CODE = require("../utils/errorCodes");

const protectRoute = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(ERROR_CODE.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserSchema.findOne({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      return next(new AppError(ERROR_CODE.NOT_FOUND));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    return next(error);
  }
};

module.exports = { protectRoute };
