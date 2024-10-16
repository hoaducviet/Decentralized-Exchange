const hre = require("hardhat");
const NFTMarket = require("../ignition/modules/NFTMarket");

async function main() {
  const { nftMarket } = await hre.ignition.deploy(NFTMarket);

  console.log(`Market deployed to: ${await nftMarket.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
