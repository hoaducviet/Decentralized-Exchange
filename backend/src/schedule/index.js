const cron = require("node-cron");
const TokenController = require("../controllers/TokenController");

const task = cron.schedule("0 0 * * *", async () => {
  console.log("Cron job đang chạy vào mỗi phút!");
  await TokenController.updatePriceRefercence();
  await TokenController.updateTotalSupply();
});

function schedule() {
  task.start();
}

module.exports = schedule;
