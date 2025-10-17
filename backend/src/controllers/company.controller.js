const Company = require("../models/company.model");
const companyService = require("../services/company.service");

const cloudinary = require("../config/cloudinary");

const AppError = require("../utils/AppError");
const fs = require("fs");
const { responseSuccess } = require("../utils/response");
const ERROR_CODE = require("../utils/errorCodes");

const getAllCompany = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompany();
    if (companies.length > 0) {
      return responseSuccess(
        res,
        "Get all companies successfully.",
        companies,
        200
      );
    }
    next(AppError.template(ERROR_CODE.NOT_FOUND));
  } catch (error) {
    next(error);
  }
};

const getInfoCompany = async (req, res, next) => {
  const { id } = req.params;
  try {
    const company = await companyService.findById(id);

    if (!company) {
      next(AppError.template(ERROR_CODE.NOT_FOUND));
    } else {
      responseSuccess(res, "Get info company successfully.", company, 200);
    }
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  const { name, website, description } = req.body || {};
  const userId = req.user._id;
  const logoFile = req.file;

  try {
    if (!name && !website && !description && !logoFile) {
      return next(
        new AppError("Please provide all required company information.", 400, {
          code: "INVALID_DATA",
        })
      );
    }

    const existingCompany = await companyService.findByOwnerId(userId);
    if (existingCompany) {
      return next(
        new AppError("You have already created a company.", 400, {
          code: "BAD_REQUEST",
        })
      );
    }

    const cloudinaryRes = await cloudinary.uploader.upload(logoFile.path, {
      folder: "company_logo",
    });

    // Xóa file tạm thời sau khi upload xong
    fs.unlink(logoFile.path, (err) => {
      if (err) console.log("Error deleting temp file:", err);
    });

    const newCompany = await companyService.createCompany({
      name,
      website,
      description,
      logo: cloudinaryRes.secure_url,
      owner: userId,
    });

    if (!newCompany) {
      next(AppError.template(ERROR_CODE.BAD_REQUEST));
    }

    responseSuccess(res, "Create company successfully", newCompany, 201);
  } catch (error) {
    fs.unlink(logoFile.path, (err) => {
      if (err) console.log("Error deleting temp file on error:", err);
    });

    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  const { name, website, description } = req.body || {};
  let logoFile = req.file;
  try {
    if (!logoFile && !name && !description && !website) {
      next(
        new AppError("No fields have been updated.", 400, {
          code: "BAD_REQUEST",
        })
      );
    }

    const company = await companyService.findByOwnerId(req.user._id);

    if (!company) return next(AppError.template(ERROR_CODE.NOT_FOUND));

    let logoUrl = company.logo;

    if (logoFile) {
      const cloudinaryRes = await cloudinary.uploader.upload(logoUrl);
      logoUrl = cloudinaryRes.secure_url;
    }

    const updateFields = {
      ...req.body,
      logo: logoUrl,
    };

    const updatedCompany = await companyService.updateById(
      company._id,
      updateFields
    );

    if (!updatedCompany) {
      next(AppError.template(ERROR_CODE.BAD_REQUEST));
    }

    responseSuccess(
      res,
      "Company information updated successfully",
      updatedCompany,
      200
    );
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCompany = await companyService.deleteById(id);
    if (!existingCompany) {
      return next(AppError.template(ERROR_CODE.BAD_REQUEST));
    }

    responseSuccess(res, "Delete company successfully", null, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompany,
  getInfoCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};
