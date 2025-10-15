const express = require("express");
const router = express.Router();

const passport = require("../config/passport");

const { protectRoute } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");
const { validate } = require("../middlewares/validate");

const {
  oauth2Login,
  login,
  register,
  logout,
  checkAuth,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require("../controllers/authController");

/* Route to start OAuth2 authentication */
// [GET] /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/* Callback route for OAuth2 authentication */
// [GET] /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  oauth2Login
);

// [POST] /api/auth/register
router.post("/register", registerValidator, validate, register);

// [POST] /api/auth/login
router.post("/login", loginValidator, validate, login);

// [POST] /api/auth/logout
router.post("/logout", logout);

// [GET] /api/auth/check
router.get("/check", protectRoute, checkAuth);

// [PUT] /api/auth/update-profile
router.put(
  "/update-profile",
  protectRoute,
  upload.single("avatar"),
  updateProfile
);

// [POST] /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// [POST] /api/auth/reset-password?token=abc
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

// [POST] /api/auth/refresh-token
router.post("/refresh-token", refreshToken);

module.exports = router;
