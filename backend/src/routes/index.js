const apiRouter = require("./api");
const adminRouter = require("./admin");
const siteRouter = require("./site");
const paymentRouter = require("./payment");

function route(app) {
  app.use("/payment", paymentRouter);
  app.use("/api", apiRouter);
  app.use("/admin", adminRouter);
  app.use("/", siteRouter);
}
module.exports = route;
