const cron = require("node-cron");
const TokenController = require("../controllers/TokenController");
const OrderController = require("../controllers/OrderController");

const task = cron.schedule("0 0 * * *", async () => {
  console.log("Cron job đang chạy vào mỗi phút!");
  await TokenController.updatePriceRefercence();
  await TokenController.updateTotalSupply();
});

const cancelOrderTask = cron.schedule("*/30 * * * *", async () => {
  console.log("Cron job đang chạy vào mỗi 30 phút!");
  await OrderController.cancelOrderAuto();
});

function schedule() {
  task.start();
  cancelOrderTask.start();
  // setInterval(async () => {
  //   console.log("Auto");
  //   await OrderController.cancelOrderAuto();
  // }, 5000);
}

module.exports = schedule;
