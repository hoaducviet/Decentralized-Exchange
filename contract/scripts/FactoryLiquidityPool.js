const hre = require("hardhat");
const FactoryLiquidityPool = require("../ignition/modules/FactoryLiquidityPool");

async function main() {
  const { factoryLiquidityPool } = await hre.ignition.deploy(FactoryLiquidityPool);

  console.log(`Factory deployed to: ${await factoryLiquidityPool.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
