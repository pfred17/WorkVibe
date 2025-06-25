const express = require("express");
const {
  login,
  register,
  logout,
  checkAuth,
} = require("../controllers/authController");
const { protectRoute } = require("../middlewares/authMiddileware");
const router = express.Router();

// [POST] /api/auth/register
router.post("/register", register);

// [POST] /api/auth/login
router.post("/login", login);

// [POST] /api/auth/logout
router.post("/logout", logout);

// [GET] /api/auth/check
router.get("/check", protectRoute, checkAuth);

module.exports = router;
