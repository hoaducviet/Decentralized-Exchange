const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const folderPath = "../data/collections";
const nftMarketAddress = process.env.NFT_MARKET_ADDRESS;

async function main() {
  const files = fs.readdirSync(folderPath);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  //   Load dữ liệu từ mỗi file JSON và lưu vào một mảng
  const collections = jsonFiles.map((file) => {
    const filePath = path.join(folderPath, file);
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  });

  const contract = await ethers.getContractAt("NFTMarket", nftMarketAddress);

  await Promise.all(
    collections.map(async (collection) => {
      const receipt = await contract.createCollection(
        collection.name,
        collection.symbol
      );
      await receipt.wait();

      console.log(receipt.hash);
    })
  );

  const allCollections = await contract.getAllCollection();

  const allCollectionsData = allCollections.map((item) => ({
    address: item[0],
    name: item[1],
    symbol: item[2],
  }));

  const jsonData = JSON.stringify(allCollectionsData, null, 2); // Định dạng

  // Ghi dữ liệu ra file JSON
  fs.writeFile("collections.json", jsonData, (err) => {
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
