const fs = require("fs");
const hre = require("hardhat");
const FactoryNFT = require("../ignition/modules/FactoryNFT");
const collectionsBuild = require("../assets/collectionsBuild.json");

async function main() {
  const { factoryNFT } = await hre.ignition.deploy(FactoryNFT);

  await Promise.all(
    collectionsBuild.map(async ({ name, symbol, uri, base_url }) => {
      const receipt = await factoryNFT.createCollection(
        name,
        symbol,
        uri,
        base_url
      );
      await receipt.wait();
    })
  );

  const allCollections = await factoryNFT.getAllCollection();

  const collections = allCollections.map((item) => ({
    address: item[0],
    name: item[1],
    symbol: item[2],
    uri: item[3],
  }));

  const jsonData = JSON.stringify(collections, null, 2); // Định dạng

  // Ghi dữ liệu ra file JSON
  fs.writeFile("./assets/collections.json", jsonData, (err) => {
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
