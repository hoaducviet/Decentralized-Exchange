const fs = require("fs");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const MarketNFT = require("../ignition/modules/MarketNFT");
const collections = require("../assets/collections.json");

async function main() {
  const { marketNFT } = await hre.ignition.deploy(MarketNFT);

  await Promise.all(
    collections.map(async ({ address }) => {
      const receipt = await marketNFT.addCollection(address, {
        value: ethers.parseEther('1'),
      });
      await receipt.wait();
    })
  );

  const allCollections = await marketNFT.getAllActiveCollection();
  const activeCollections = allCollections.map((item) => ({
    address: item[0],
    uri: item[1],
  }));

  const jsonData = JSON.stringify(activeCollections, null, 2);
  fs.writeFile("./assets/activeCollections.json", jsonData, (err) => {
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
