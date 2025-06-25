const UserSchema = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields is require.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters.",
        });
      }

      const user = await UserSchema.findOne({ email });

      if (user) {
        return res.status(400).json({
          message: "Email already exists.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hassedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserSchema({
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
        res.status(400).json({
          message: "Invalid user data.",
        });
      }
    } catch (error) {
      console.log("Error in controler signup ", error.message);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserSchema.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "Invalid cretendials.",
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "Invalid cretendials.",
        });
      }

      generateToken(user._id, res);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    } catch (error) {
      console.log("Error in controler login", error.message);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  }

  logout(req, res) {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({
        message: "Logged out successfully.",
      });
    } catch (error) {
      console.log("Error in controler logout", error.message);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  }

  checkAuth(req, res) {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in controler checkauth", error.message);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  }
}

module.exports = new AuthController();
