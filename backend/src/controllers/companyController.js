const Company = require("../models/Company");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");
const fs = require("fs");

const getAllCompany = async (req, res, next) => {
  try {
    const companys = await Company.find({});
    res.status(200).json({
      message: "Get all companys successfully.",
      data: companys,
    });
  } catch (error) {
    next(error);
  }
};

const getInfoCompany = async (req, res, next) => {
  const { id } = req.params;
  try {
    const company = await Company.findById(id);

    if (!company) {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "Company not found.",
      });
    } else {
      res.status(200).json({
        company,
      });
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
        new AppError("Please provide all required company information.", 400)
      );
    }

    const existingCompany = await Company.findOne({ owner: userId });
    if (existingCompany) {
      return next(new AppError("You have already created a company.", 400));
    }

    const cloudinaryRes = await cloudinary.uploader.upload(logoFile.path, {
      folder: "company_logo",
    });

    // Xóa file tạm thời sau khi upload xong
    fs.unlink(logoFile.path, (err) => {
      if (err) console.log("Error deleting temp file:", err);
    });

    const newCompany = new Company({
      name,
      website,
      description,
      logo: cloudinaryRes.secure_url,
      owner: userId,
    });

    if (newCompany) {
      await newCompany.save();
      res.status(201).json({
        message: "Create company successfully.",
        company: newCompany,
      });
    }
  } catch (error) {
    fs.unlink(logoFile.path, (err) => {
      if (err) console.log("Error deleting temp file on error:", err);
    });

    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  const { id } = req.params;
  const { name, website, description } = req.body || {};
  let logoFile = req.file;
  try {
    if (!logoFile && !name && !description && !website) {
      return res.status(400).json({
        message: "No fields have been updated.",
      });
    }

    const company = await Company.findById(id);

    if (!company) return next(new AppError("Company not exsits."));

    let logoUrl = company.logo;

    if (logoFile) {
      const cloudinaryRes = await cloudinary.uploader.upload(logoUrl);
      logoUrl = cloudinaryRes.secure_url;
    }

    const updateFields = {
      ...req.body,
      logo: logoUrl,
    };

    const updatedCompany = await Company.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedCompany) {
      return res.status(400).json({
        message: "Update info company failed.",
      });
    }

    res.status(200).json({
      message: "Update company information successfully.",
      company: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCompany = await Company.findByIdAndDelete(id);
    if (!existingCompany) {
      return next(new AppError("Delete company faild.", 400));
    }

    res.status(200).json({
      message: "Delete company successfully.",
    });
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
