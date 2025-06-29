const authRoute = require("./auth");
const companyRoute = require("./company");

const route = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/company", companyRoute);
};

module.exports = route;
