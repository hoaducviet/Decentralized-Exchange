const { initiateValueNFT } = require("../../utils/initiateValueNFT");
const collections = require("../../assets/collections.json");
const collection = collections.find((item) => item.symbol === "COOL");
const nfts = require("../../assets/NFT/Cool Cats.json");

async function main() {
  await initiateValueNFT(nfts, collection);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
