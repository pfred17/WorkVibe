const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = require("../utils/generateToken");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { sendResetPasswordEmail } = require("../utils/mailer");
const AppError = require("../utils/AppError");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user) return next(new AppError("Email already exists.", 400));

    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hassedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        message: "Register successfully.",
      });
    } else {
      next(new AppError("Invalid user data.", 400));
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return next(new AppError("User not found.", 404));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return next(new AppError("Invalid cretendials.", 400));

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { description, phone, dateOfBirth, gender, address } = req.body || {};

  const avatarFile = req.file;

  try {
    if (
      !avatarFile &&
      !description &&
      !phone &&
      !dateOfBirth &&
      !gender &&
      !address
    )
      return next(new AppError("No fields have been updated.", 400));

    let avatarUrl = req.user.avatar;

    if (avatarFile) {
      const cloudinaryRes = await cloudinary.uploader.upload(avatarFile.path, {
        folder: "user_avatars",
      });
      avatarUrl = cloudinaryRes.secure_url;

      // Xóa file tạm thời sau khi upload xong
      fs.unlink(avatarFile.path, (err) => {
        if (err) console.log("Error deleting temp file:", err);
      });
    }

    const updateFields = {
      avatar: avatarUrl,
      description: description || req.user.description,
      phone: phone || req.user.phone,
      dateOfBirth: dateOfBirth || req.user.dateOfBirth,
      gender: gender || req.user.gender,
      address: address || req.user.address,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile:", error.message);

    if (avatarFile) {
      fs.unlink(avatarFile.path, (err) => {
        if (err) console.log("Error deleting temp file on error:", err);
      });
    }

    next(error);
  }
};

const checkAuth = (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user.undefinedMethod()); // sẽ throw TypeError
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const tokenReset = generateToken(user._id);

    await sendResetPasswordEmail(email, tokenReset);

    res.status(200).json({
      message: "Send request successfully. Please check your email!",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.query;
  const { resetPassword } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return next(new AppError("Email not found.", 404));

    if (resetPassword?.length < 6)
      return next(new AppError("Password must be at least 6 characters.", 400));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(resetPassword, salt);

    await user.save();

    res.status(200).json({ message: "Reset password successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  checkAuth,
  updateProfile,
  forgotPassword,
  resetPassword,
};
