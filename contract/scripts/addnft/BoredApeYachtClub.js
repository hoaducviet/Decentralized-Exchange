const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const collections = require("../../collections.json");
const collection = collections.find((item) => item.symbol === "BAYC");
async function main() {
  const folderPath = `../data/metadata/${collection.name}`;

  const files = fs.readdirSync(folderPath);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const nfts = jsonFiles.map((file) => {
    const filePath = path.join(folderPath, file);
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  });
  const contract = await ethers.getContractAt(
    "NFTCollection",
    collection.address
  );
  await Promise.all(
    nfts.map(async (nft) => {
      try {
        const receipt = await contract.createNFT(
          process.env.ACCOUT_ADDRESS_HARDHAT,
          nft.token_uri
        );
        await receipt.wait();
        console.log(receipt.hash);
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  );

  const allNFT = await contract.getAllNFTInfo();
  const allNFTsDatas = allNFT.map((item) => ({
    id: Number(item[0]),
    price: Number(item[1]),
    uri: item[2],
  }));

  const allNFTsData = allNFTsDatas.filter((item) => item.id !== 0);
  await Promise.all(
    allNFTsData.map(async (item) => {
      try {
        const price = Math.random() * 10;
        const receipt = await contract.listNFT(
          item.id,
          ethers.parseEther(price.toString())
        );
        await receipt.wait();

        console.log("Listed ", receipt.hash);
      } catch (error) {
        console.log(error);
      }
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
