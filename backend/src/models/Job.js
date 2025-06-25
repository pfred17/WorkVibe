const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: {
      min: Number,
      max: Number,
    },
    tags: [String], // ví dụ: ['React', 'Node', 'Full-time']
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
    isActive: { type: Boolean, default: true },
    deadline: Date,
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
