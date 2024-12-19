const { initiateValueNFT } = require("../../utils/initiateValueNFT");
const collections = require("../../assets/collections.json");
const nfts = require("../../assets/NFT/Block Queens by Jeremy Cowart.json");
const collection = collections.find((item) => item.symbol === "BQ");

async function main() {
  await initiateValueNFT(nfts, collection);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
