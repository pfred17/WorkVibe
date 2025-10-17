const express = require("express");
const router = express.Router();

const {
  getAllJob,
  getJobById,
  createNewJob,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

// [GET] /api/job
router.get("/", protectRoute, getAllJob);

// [GET] /api/job/:id
router.get("/:id", protectRoute, getJobById);

// [POST] /api/job/create
router.post("/create", protectRoute, createNewJob);

// [PUT] /api/job/update/:id
router.put("/update/:id", protectRoute, updateJob);

// [DELETE] /api/job/delete/:id
router.delete("/delete/:id", protectRoute, deleteJob);

module.exports = router;
