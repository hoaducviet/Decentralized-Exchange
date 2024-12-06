const cron = require("node-cron");
const TokenController = require("../controllers/TokenController");
const OrderController = require("../controllers/OrderController");
const { exchangeTokenAuto } = require("../utils/exchangeTokenAuto");
const { exchangeLiquidityAuto } = require("../utils/exchangeLiquidityAuto");

const task = cron.schedule("0 0 * * *", async () => {
  console.log("Cron job đang chạy vào mỗi phút!");
  await TokenController.updatePriceRefercence();
  await TokenController.updateTotalSupply();
});

const cancelOrderTask = cron.schedule("*/30 * * * *", async () => {
  console.log("Cron job đang chạy vào mỗi 30 phút!");
  await OrderController.cancelOrderAuto();
});

async function schedule() {
  task.start();
  cancelOrderTask.start();

  setInterval(async () => {
    try {
      await exchangeTokenAuto();
    } catch (error) {
      console.error("Error in exchangeTokenAuto:", error);
    }
  }, 5000);

  await new Promise((resolve) => setTimeout(resolve, 7500));

  // setInterval(async () => {
  //   try {
  //     await exchangeLiquidityAuto();
  //   } catch (error) {
  //     console.error("Error in exchangeLiquidityAuto:", error);
  //   }
  // }, 15000);
}

module.exports = schedule;
