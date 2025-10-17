const express = require("express");
const router = express.Router();

const {
  create,
  getMyApplications,
  getApplicationById,
  getApplicationsForJob,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/application.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

// [POST] /api/application/pend  (Nộp đơn ứng tuyển)
router.post("/pend", protectRoute, create);

// [GET] /api/application/me (Xem các đơn ứng tuyển đã nộp)
router.get("/me", protectRoute, getMyApplications);

// [GET] /api/application/:id (Lấy chi tiết một đơn ứng tuyển)
router.get("/:id", protectRoute, getApplicationById);

// [GET] /api/application/:jobId (Nhà tuyển dụng xem các đơn ứng tuyển cho một job cụ thể)
router.get("/:jobId", protectRoute, getApplicationsForJob);

// [PUT] /api/application/update/:id (Cập nhật trạng thái đơn ứng tuyển (duyệt, từ chối,...))
router.put("/update/:id", protectRoute, updateApplicationStatus);

// [DELETE] /api/application/delete/:id (Xoá đơn ứng tuyển)
router.delete("/delete/:id", protectRoute, deleteApplication);
module.exports = router;
