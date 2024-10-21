const { ethers } = require("hardhat");
const pools = require("../pools.json");

const pool = pools[5];
async function main() {
  if (pool.addressToken2 !== "0x0000000000000000000000000000000000000000") {
    const poolContract = await ethers.getContractAt(
      "LiquidityPool",
      pool.address
    );

    const amountToken1 = ethers.parseUnits("1", pool.decimals1); // Số lượng token bạn muốn thêm
    const amountToken2 = ethers.parseUnits("1", pool.decimals2); // Số lượng token bạn muốn thêm

    const approveTokens = async () => {
      const token1Contract = await ethers.getContractAt(
        "ERC20",
        pool.addressToken1
      );
      const approveTx1 = await token1Contract.approve(
        pool.address,
        amountToken1
      );

      await approveTx1.wait();
      console.log(amountToken1);
      console.log(
        `Approved ${amountToken1} of token1 ${pool.addressToken1} for pool at ${pool.address}`
      );
      const token2Contract = await ethers.getContractAt(
        "ERC20",
        pool.addressToken2
      );
      const approveTx2 = await token2Contract.approve(
        pool.address,
        amountToken2
      );
      await approveTx2.wait();
      console.log(amountToken2);
      console.log(
        `Approved ${amountToken2} of token2 for pool at ${pool.address}`
      );
    };

    const addLiquidity = async () => {
      const tx = await poolContract.addLiquidity(amountToken1, amountToken2);
      await tx.wait();
      console.log(`Adding liquidity to pool at ${pool.address}...`);
    };

    await approveTokens();
    await addLiquidity();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
