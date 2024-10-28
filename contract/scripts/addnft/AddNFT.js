const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const collections = require("../collections.json");

async function main() {
  collections.map(async (collection) => {
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

    nfts.map(async (nft) => {
      try {
        const receipt = await contract.createNFT(
          process.env.ACCOUT_ADDRESS_HARDHAT,
          nft.token_uri
        );
        await receipt.wait();

        
      } catch (error) {
        // console.log(error);
        throw error;
      }
    });

    console.log(collection.name)
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
