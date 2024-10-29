const { ethers } = require("hardhat");

async function main() {
  async function checkBlockNumber() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const blockNumber = await provider.getBlockNumber();
    console.log("Current Hardhat Block Number:", blockNumber);
  }

  checkBlockNumber();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
