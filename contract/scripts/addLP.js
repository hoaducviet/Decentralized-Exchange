const { ethers } = require("hardhat");
const pools = require("../pools.json");

async function main() {
  await Promise.all(
    pools.map(async (pool) => {
      const amountToken1 = ethers.parseUnits("3", pool.decimals1);
      const amountToken2 = ethers.parseUnits("2", pool.decimals2);

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

      const amountToken1 = ethers.parseUnits("3", pool.decimals1);
      const amountToken2 = ethers.parseUnits("2", pool.decimals2);

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
