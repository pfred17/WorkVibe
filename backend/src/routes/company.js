const express = require("express");
const router = express.Router();

const {
  getAllCompany,
  getInfoCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const { protectRoute } = require("../middlewares/authMiddleware");

// [GET] /api/company
router.get("/", getAllCompany);

// [GET] /api/company/:id
router.get("/:id", getInfoCompany);

// [POST] /api/company/create
router.post("/create", protectRoute, createCompany);

// [PUT] /api/company/update/:id
router.put("/update/:id", protectRoute, updateCompany);

// [POST] /api/delete/:id
router.delete("/delete/:id", protectRoute, deleteCompany);

module.exports = router;
