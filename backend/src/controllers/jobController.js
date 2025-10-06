const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");

const getAllJob = async (req, res) => {
  const filters = {};
  try {
    if (req.query.search) {
      filters.title = { $regex: req.query.search, $options: "i" };
    }

    const jobs = await Job.find(filters)
      .populate("company", "name logo")
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "INTERNAL_SERVER_ERROR", message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name logo"
    );

    if (!job) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ error: "INTERNAL_SERVER_ERROR", message: error.message });
  }
};
const createNewJob = async (req, res) => {
  try {
    const employerId = req.user._id;
    const newJob = new Job({
      ...req.body,
      employer: employerId,
    });
    const savedJob = await newJob.save();

    if (savedJob) {
      res.status(201).json({
        message: "Create a new job successfully.",
        job: savedJob,
      });
    }
  } catch (error) {
    console.log(
      "Error in controller job at function 'create': ",
      error.message
    );
    res
      .status(500)
      .json({ error: "INTERNAL_SERVER_ERROR", message: error.message });
  }
};
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const existingJob = await Job.findByIdAndUpdate(id, ...req.body, {
      new: true,
    });

    if (!existingJob) {
      return res.status(400).json({
        message: "Update job faild.",
      });
    }

    res.status(200).json({
      message: "Update job successfully.",
      jpb: existingJob,
    });
  } catch (error) {
    console.log(
      "Error in controller job at function 'update': ",
      error.message
    );
    res
      .status(500)
      .json({ error: "INTERNAL_SERVER_ERROR", message: error.message });
  }
};
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const existingJob = await Job.findByIdAndDelete(id);

    if (!existingJob) {
      return res.status(400).json({
        message: "Delete job faild.",
      });
    }

    res.status(200).json({
      message: "Delete job successfully.",
    });
  } catch (error) {
    console.log(
      "Error in controller job at function 'delete': ",
      error.message
    );
    res
      .status(500)
      .json({ error: "INTERNAL_SERVER_ERROR", message: error.message });
  }
};

module.exports = { getAllJob, getJobById, createNewJob, updateJob, deleteJob };
