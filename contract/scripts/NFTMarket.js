const hre = require("hardhat");
const NFTMarket = require("../ignition/modules/NFTMarket");

async function main() {
  const { nftMarket } = await hre.ignition.deploy(NFTMarket);

  console.log(`Market deployed to: ${await nftMarket.getAddress()}`);

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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
