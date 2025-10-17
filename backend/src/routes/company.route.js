const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");

const {
  getAllCompany,
  getInfoCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

// [GET] /api/company
router.get("/", getAllCompany);

// [GET] /api/company/:id
router.get("/:id", getInfoCompany);

// [POST] /api/company/create
router.post("/create", protectRoute, upload.single("logo"), createCompany);

// [PUT] /api/company/update/:id
router.put("/update/:id", protectRoute, upload.single("logo"), updateCompany);

// [POST] /api/delete/:id
router.delete("/delete/:id", protectRoute, deleteCompany);

module.exports = router;
