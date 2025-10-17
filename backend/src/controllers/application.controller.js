const Application = require("../models/application.model");

// Nộp đơn ứng tuyển
const create = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;
    const applicant = req.user._id;

    const newApplication = new Application({
      job: jobId,
      applicant,
      resumeUrl,
      coverLetter,
    });

    const savedApplication = newApplication.save();

    if (!savedApplication) {
      return res.status(400).json({
        message: "Pend application to server failed.",
      });
    }

    res.status(201).json({
      message: "Pend application to server successfullly.",
      application: savedApplication,
    });
  } catch (error) {
    console.log(
      "Error in controller APPLICATION at function 'create': ",
      error.message
    );
    res.status(500).json({
      error: "SERVER_INTERNAL_ERROR",
      message: error.message,
    });
  }
};

// Xem các đơn ứng tuyển đã nộp
const getMyApplications = async (req, res) => {
  try {
    const myApplication = await Application.find({ applicant: req.user._id });

    if (!myApplication) {
      return res.status(400).json({
        message: "Get my application failed.",
      });
    }

    res.status(200).json({
      message: "Get my application failed.",
      applications: myApplication,
    });
  } catch (error) {
    console.log(
      "Error in controller APPLICATION at function 'getMyApplications': ",
      error.message
    );
    res.status(500).json({
      error: "SERVER_INTERNAL_ERROR",
      message: error.message,
    });
  }
};

// Lấy chi tiết một đơn ứng tuyển
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingApplication = await Application.findById(id);

    if (!existingApplication) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Application not found.",
      });
    }

    res.status(200).json({
      message: "Get application successfully.",
      application: existingApplication,
    });
  } catch (error) {
    console.log(
      "Error in controller APPLICATION at function 'getApplicationById': ",
      error.message
    );
    res.status(500).json({
      error: "SERVER_INTERNAL_ERROR",
      message: error.message,
    });
  }
};

// Nhà tuyển dụng xem các đơn ứng tuyển cho một job cụ thể
const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const existingApplicationForJobs = await Application.find({ job: jobId });

    if (!existingApplicationForJobs) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "No applications found for this job.",
      });
    }

    res.status(200).json({
      message: "Get a list of applications for this job successfully.",
      application: existingApplicationForJobs,
    });
  } catch (error) {
    console.log(
      "Error in controller APPLICATION at function 'getApplicationsForJob': ",
      error.message
    );
    res.status(500).json({
      error: "SERVER_INTERNAL_ERROR",
      message: error.message,
    });
  }
};

// Cập nhật trạng thái đơn ứng tuyển (duyệt, từ chối,...)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const existingApplicationToUpdate = await Application.findByIdAndUpdate(
      id,
      status,
      { new: true }
    );

    if (!existingApplicationToUpdate) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Update status for this application failed.",
      });
    }

    res.status(200).json({
      message: "Update status for this application successfully.",
      application: existingApplicationToUpdate,
    });
  } catch (error) {
    console.log(
      "Error in controller APPLICATION at function 'updateApplicationStatus': ",
      error.message
    );
    res.status(500).json({
      error: "SERVER_INTERNAL_ERROR",
      message: error.message,
    });
  }
};

// Xoá đơn ứng tuyển
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const existingApplicationToDelete = await Application.findByIdAndDelete(id);

    if (!existingApplicationToDelete) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Delete application failed.",
      });
    }

    res.status(200).json({
      message: "Delete application successfully.",
      application: existingApplicationToDelete,
    });
  } catch (error) {
    console.log(
      "Error in controller APPLICATION at function 'deleteApplication': ",
      error.message
    );
    res.status(500).json({
      error: "SERVER_INTERNAL_ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getMyApplications,
  getApplicationById,
  getApplicationsForJob,
  updateApplicationStatus,
  deleteApplication,
};
