const jwt = require("jsonwebtoken");
const UserSchema = require("../models/User");
const AppError = require("../utils/AppError");

const protectRoute = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserSchema.findOne({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      return next(new AppError("User not found", 404));
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
    return next(error); // cho errorHandler xử lý
  }
};

module.exports = { protectRoute };
