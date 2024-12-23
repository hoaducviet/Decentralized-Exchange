const hre = require("hardhat");
const OrderLimit = require("../ignition/modules/OrderLimit");

async function main() {
  const { orderLimit } = await hre.ignition.deploy(OrderLimit);
  const contractAddress = await orderLimit.getAddress();

  const [sender] = await hre.ethers.getSigners();
  const tx = await sender.sendTransaction({
    to: contractAddress, // Địa chỉ contract nhận ETH
    value: hre.ethers.parseEther("1"), // Số ETH gửi (đơn vị wei)
  });
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
