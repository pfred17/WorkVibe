const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website: String,
    description: String,
    logo: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema, "companies");
module.exports = Company;
