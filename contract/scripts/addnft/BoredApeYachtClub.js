const { initiateValueNFT } = require("../../utils/initiateValueNFT");
const collections = require("../../assets/collections.json");
const collection = collections.find((item) => item.symbol === "BAYC");
const nfts = require("../../assets/NFT/Bored Ape Yacht Club.json");

async function main() {
  await initiateValueNFT(nfts, collection);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
