const cron = require("node-cron");
const TokenController = require("../controllers/TokenController");
const OrderController = require("../controllers/OrderController");
const { exchangeTokenAuto } = require("../utils/exchangeTokenAuto");
const { exchangeLiquidityAuto } = require("../utils/exchangeLiquidityAuto");

const task = cron.schedule("0 0 * * *", async () => {
  console.log("Cron job đang chạy vào 12h đêm!");
  await TokenController.updatePriceRefercence();
  await TokenController.updateTotalSupply();
});

const cancelOrderTask = cron.schedule("*/30 * * * *", async () => {
  console.log("Cron job đang chạy vào mỗi 30 phút!");
  await OrderController.cancelOrderAuto();
});

const auto = 0;

async function schedule() {
  task.start();
  cancelOrderTask.start();

  //Trigger only one time for update price tokens
  setTimeout(async () => {
    console.log("Chạy sau 20 giây khởi động!");
    await TokenController.updatePriceRefercence();
    await TokenController.updateTotalSupply();
  }, 20000);

  setInterval(async () => {
    if (auto === 1) {
      try {
        await exchangeTokenAuto();
      } catch (error) {
        console.error("Error in exchangeTokenAuto:", error);
      }
    }
  }, 5000);

  if (auto === 2) {
    setInterval(async () => {
      try {
        await exchangeTokenAuto();
      } catch (error) {
        console.error("Error in exchangeTokenAuto:", error);
      }
    }, 15000);

    await new Promise((resolve) => setTimeout(resolve, 7500));

    setInterval(async () => {
      try {
        await exchangeLiquidityAuto();
      } catch (error) {
        console.error("Error in exchangeLiquidityAuto:", error);
      }
    }, 15000);
  }
}

module.exports = schedule;
