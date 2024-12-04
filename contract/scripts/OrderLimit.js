const hre = require("hardhat");
const OrderLimit = require("../ignition/modules/OrderLimit");

async function main() {
  const { orderLimit } = await hre.ignition.deploy(OrderLimit);
  console.log(`Order limit deployed to: ${await orderLimit.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
