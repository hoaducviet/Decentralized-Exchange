const apiRouter = require("./api");
const adminRouter = require("./admin");
const paymentRouter = require("./pay");

function route(app) {
  app.use("/pay", paymentRouter);
  app.use("/api", apiRouter);
  app.use("/admin", adminRouter);
}
module.exports = route;
