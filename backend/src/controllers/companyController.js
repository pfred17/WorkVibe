const Company = require("../models/Company");
const cloudinary = require("../config/cloudinary");

class CompanyController {
  async getAllCompany(req, res) {
    try {
      const companys = await Company.find({}, "-password");
      res.status(200).json({
        message: "Get all companys successfully.",
        data: companys,
      });
    } catch (error) {
      console.log(
        "Error in company controller function getAllCompany: ",
        error.message
      );
      res.status(500).json({
        message: "Server Internal Error.",
      });
    }
  }

  async getInfo(req, res) {
    try {
      const { id } = req.params;
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
      console.log(
        "Error in company controller function getInfo: ",
        error.message
      );
      res.status(500).json({
        message: "Server Internal Error.",
      });
    }
  }

  async create(req, res) {
    try {
      const { name, website, description, logo } = req.body;
      const userId = req.user._id;

      if (!name || !website || !description || !logo) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Please provide all required company information.",
        });
      }

      const existingCompany = await Company.findOne({ owner: userId });
      if (existingCompany) {
        return res.status(400).json({
          error: "COMPANY_EXISTS",
          message: "You have already created a company.",
        });
      }

      const cloudinaryRes = await cloudinary.uploader.upload(logo);

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
          company: newCompany,
          message: "Create company successfully.",
        });
      }

      // Kiểm tra xem user đã có công ty chưa
    } catch (error) {
      console.log(
        "Error in company controller function create: ",
        error.message
      );
      res.status(500).json({
        message: "Server Internal Error.",
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { logo, name, website, description } = req.body || {};

      if (!logo && !name && !description && !website) {
        return res.status(400).json({
          message: "No fields have been updated.",
        });
      }

      let logoUrl;
      if (logo) {
        const cloudinaryRes = await cloudinary.uploader.upload(logo);
        logoUrl = cloudinaryRes.secure_url;
      }

      const updateFields = {
        ...req.body,
      };
      if (logoUrl) updateFields.logo = logoUrl;

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
      console.log(
        "Error in company controller function update: ",
        error.message
      );
      res.status(500).json({
        message: "Server Internal Error.",
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existingCompany = await Company.findByIdAndDelete(id);
      if (!existingCompany) {
        return res.status(400).json({
          message: "Delete company faild.",
        });
      }

      res.status(200).json({
        message: "Delete company successfully.",
      });
    } catch (error) {
      console.log(
        "Error in company controller function delete: ",
        error.message
      );
      res.status(500).json({
        message: "Server Internal Error.",
      });
    }
  }
}

module.exports = new CompanyController();
