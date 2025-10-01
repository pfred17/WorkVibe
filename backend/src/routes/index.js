const authRoute = require("./auth");
const companyRoute = require("./company");
const jobRoute = require("./job");
const applicationRoute = require("./application");

const route = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/company", companyRoute);
  app.use("/api/job", jobRoute);
  app.use("/api/application", applicationRoute);
};

module.exports = route;
