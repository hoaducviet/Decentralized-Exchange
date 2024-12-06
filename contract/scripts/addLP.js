const { ethers } = require("hardhat");
const pools = require("../assets/pools.json");
const tokensAll = require("../assets/tokens.json");
const eth = require("../assets/eth.json");
const tokens = [eth, ...tokensAll];
const variable = 10;

async function main() {
  await Promise.all(
    pools.map(async (pool) => {
      const token1 = tokens.find((item) => item.address === pool.addressToken1);
      const token2 = tokens.find((item) => item.address === pool.addressToken2);
      const value1 = variable.toString();
      const value2 = (
        (parseFloat(token2.price) / parseFloat(token1.price)) *
        variable
      )
        .toFixed(pool.decimals1)
        .toString();

      const amountToken1 = ethers.parseUnits(value2, pool.decimals1);
      const amountToken2 = ethers.parseUnits(value1, pool.decimals2);

      const token1Contract = await ethers.getContractAt(
        "ERC20",
        pool.addressToken1
      );
      const approveTx1 = await token1Contract.approve(
        pool.address,
        amountToken1
      );
      await approveTx1.wait();

      if (pool.addressToken2 !== "0x0000000000000000000000000000000000000000") {
        const token2Contract = await ethers.getContractAt(
          "ERC20",
          pool.addressToken2
        );
        const approveTx2 = await token2Contract.approve(
          pool.address,
          amountToken2
        );
        await approveTx2.wait();
      }
    })
  );
  await Promise.all(
    pools.map(async (pool, index) => {
      const contractName =
        pool.addressToken2 !== "0x0000000000000000000000000000000000000000"
          ? "LiquidityPool"
          : "LiquidityPoolETH";
      const poolContract = await ethers.getContractAt(
        contractName,
        pool.address
      );

      const token1 = tokens.find((item) => item.address === pool.addressToken1);
      const token2 = tokens.find((item) => item.address === pool.addressToken2);
      const value1 = variable.toString();
      const value2 = (
        (parseFloat(token2.price) / parseFloat(token1.price)) *
        variable
      )
        .toFixed(pool.decimals1)
        .toString();

      const amountToken1 = ethers.parseUnits(value2, pool.decimals1);
      const amountToken2 = ethers.parseUnits(value1, pool.decimals2);

      if (pool.addressToken2 !== "0x0000000000000000000000000000000000000000") {
        const tx = await poolContract.addLiquidity(amountToken1, amountToken2);
        await tx.wait();
      } else {
        const tx = await poolContract.addLiquidity(amountToken1, {
          value: amountToken2,
        });
        await tx.wait();
      }
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
