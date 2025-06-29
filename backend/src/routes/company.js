const express = require("express");
const router = express.Router();

const CompanyController = require("../controllers/companyController");
const AuthMiddleware = require("../middlewares/authMiddileware");

// [GET] /api/company
router.get("/", CompanyController.getAllCompany);

// [GET] /api/company/:id
router.get("/:id", CompanyController.getInfo);

// [POST] /api/company/create
router.post("/create", AuthMiddleware.protectRoute, CompanyController.create);

// [PUT] /api/company/update/:id
router.put(
  "/update/:id",
  AuthMiddleware.protectRoute,
  CompanyController.update
);

// [POST] /api/delete/:id
router.delete(
  "/delete/:id",
  AuthMiddleware.protectRoute,
  CompanyController.delete
);

module.exports = router;
