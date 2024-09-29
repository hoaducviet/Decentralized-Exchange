const apiRouter = require("./api");
const adminRouter = require("./admin");
const siteRouter = require("./site");

function route(app) {
  app.use("/api", apiRouter);
  app.use("/admin", adminRouter);
  app.use("/", siteRouter);
}
module.exports = route;
