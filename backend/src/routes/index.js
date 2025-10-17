const authRoute = require("./auth.route");
const companyRoute = require("./company.route");
const jobRoute = require("./job.route");
const applicationRoute = require("./application.route");

const route = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/company", companyRoute);
  app.use("/api/job", jobRoute);
  app.use("/api/application", applicationRoute);
};

module.exports = route;
