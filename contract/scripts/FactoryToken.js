const hre = require("hardhat");
const FactoryToken = require("../ignition/modules/FactoryToken");

async function main() {
  const { factoryToken } = await hre.ignition.deploy(FactoryToken);

  console.log(`Factory deployed to: ${await factoryToken.getAddress()}`);

  const receipt = await factoryToken.createToken(
    "Gold",
    "GDT",
    process.env.ACCOUT_ADDRESS_HARDHAT,
    90000
  ); // Gọi hàm launch
  await receipt.wait(); // Chờ giao dịch hoàn thành

  console.log(`Token launched! Transaction hash: ${receipt.hash}`);

  const allTokens = await factoryToken.getAllTokens();
  console.log(allTokens);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
