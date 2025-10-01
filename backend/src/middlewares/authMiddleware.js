const jwt = require("jsonwebtoken");
const UserSchema = require("../models/User");

const protectRoute = async (req, res, next) => {
  const token = req.cookies?.jwt;

  try {
    if (!token) {
      return res.status(400).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    const user = await UserSchema.findOne({ _id: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({
      message: "Server Internal Error.",
    });
  }
};

module.exports = { protectRoute };
