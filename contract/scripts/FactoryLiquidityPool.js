const fs = require("fs");
const hre = require("hardhat");
const FactoryLiquidityPool = require("../ignition/modules/FactoryLiquidityPool");
const tokens = require("../assets/tokens.json");

async function main() {
  const { factoryLiquidityPool } = await hre.ignition.deploy(
    FactoryLiquidityPool
  );

  await Promise.all(
    tokens.map(async (token, index) => {
      for (let i = index + 1; i < tokens.length; i++) {
        const receipt = await factoryLiquidityPool.createLiquidityPool(
          token.address,
          tokens[i].address
        );
        await receipt.wait();
      }
    })
  );
  await Promise.all(
    tokens.map(async (token) => {
      const receipt = await factoryLiquidityPool.createLiquidityPoolETH(
        token.address
      );
      await receipt.wait();
    })
  );

  const allPools = await factoryLiquidityPool.getAllPool();

  const allPoolsData = allPools.map((item) => ({
    name: item[0],
    address: item[1],
    addressLPT: item[2],
    decimals1: Number(item[3]),
    addressToken1: item[4],
    decimals2: Number(item[5]),
    addressToken2: item[6],
  }));

  const jsonData = JSON.stringify(allPoolsData, null, 2); // Định dạng

  // Ghi dữ liệu ra file JSON
  fs.writeFile("./assets/pools.json", jsonData, (err) => {
    if (err) {
      console.error("Error writing file", err);
    } else {
      console.log("File has been written");
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
