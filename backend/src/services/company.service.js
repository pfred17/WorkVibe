const Company = require("../models/company.model");

exports.getAllCompany = async () => {
  return await Company.find({});
};

exports.findById = async (id) => {
  return await Company.findById(id);
};

exports.findByOwnerId = async (ownerId) => {
  return await Company.findOne({ owner: ownerId });
};

exports.createCompany = async (data) => {
  const company = new Company(data);
  return await company.save();
};

exports.updateById = async (id, fields) => {
  return await Company.findByIdAndUpdate(id, fields, { new: true });
};

exports.deleteById = async (id) => {
  return await Company.findByIdAndDelete(id);
};
