const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const { protectRoute } = require("../middlewares/authMiddileware");

// [POST] /api/application/pend  (Nộp đơn ứng tuyển)
router.post("/pend", protectRoute, applicationController.create);

// [GET] /api/application/me (Xem các đơn ứng tuyển đã nộp)
router.get("/me", protectRoute, applicationController.getMyApplications);

// [GET] /api/application/:id (Lấy chi tiết một đơn ứng tuyển)
router.get("/:id", protectRoute, applicationController.getApplicationById);

// [GET] /api/application/:jobId (Nhà tuyển dụng xem các đơn ứng tuyển cho một job cụ thể)
router.get(
  "/:jobId",
  protectRoute,
  applicationController.getApplicationsForJob
);

// [PUT] /api/application/update/:id (Cập nhật trạng thái đơn ứng tuyển (duyệt, từ chối,...))
router.put(
  "/update/:id",
  protectRoute,
  applicationController.updateApplicationStatus
);

// [DELETE] /api/application/delete/:id (Xoá đơn ứng tuyển)
router.delete(
  "/delete/:id",
  protectRoute,
  applicationController.deleteApplication
);
module.exports = router;
