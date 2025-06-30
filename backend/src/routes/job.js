const express = require("express");
const router = express.Router();

const jobController = require("../controllers/jobController");
const { protectRoute } = require("../middlewares/authMiddileware");

// [GET] /api/job
router.get("/", protectRoute, jobController.getAllJob);

// [GET] /api/job/:id
router.get("/:id", protectRoute, jobController.getJobById);

// [POST] /api/job/create
router.post("/create", protectRoute, jobController.create);

// [PUT] /api/job/update/:id
router.put("/update/:id", protectRoute, jobController.update);

// [DELETE] /api/job/delete/:id
router.delete("/delete/:id", protectRoute, jobController.delete);

module.exports = router;
