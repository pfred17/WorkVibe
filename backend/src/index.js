// Import các thư viện cần thiết
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const route = require("./routes/index");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");
// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // để parse body JSON
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Cấu hình route
route(app);

// Error handler
app.use(errorHandler);

// Cấu hình cổng
const PORT = process.env.PORT || 5001;

// Kết nối MongoDB
connectDB();

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
