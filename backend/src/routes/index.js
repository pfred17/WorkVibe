const authRoute = require("./auth");

const route = (app) => {
  app.use("/api/auth", authRoute);
};

module.exports = route;
