const { ethers } = require("hardhat");
const addresses = require("../ignition/deployments/chain-31337/deployed_addresses.json");

async function initiateValueNFT(nfts, collection) {
  const contract = await ethers.getContractAt(
    "FactoryNFT",
    addresses["FactoryNFT#FactoryNFT"]
  );
  const martketContract = await ethers.getContractAt(
    "MarketNFT",
    addresses["MarketNFT#MarketNFT"]
  );
  const contractCollection = await ethers.getContractAt(
    "NFTCollection",
    collection.address
  );

  for (let index = 0; index < nfts.length; index++) {
    const { token_uri } = nfts[index];
    try {
      const receipt = await contract.mintNFT(collection.address, token_uri);
      await receipt.wait();

      await new Promise((resolve) => setTimeout(resolve, 1));
    } catch (error) {
      console.log(`Error minting NFT #${index}:`, error);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await contractCollection.setApprovalForAll(
    addresses["MarketNFT#MarketNFT"],
    true
  );

  // // Cấp quyền thi hành cho market
  const counter = await contractCollection.counter();
  console.log("Counter: ", counter);

  for (let index = 0; index < Number(counter); index++) {
    const price = parseFloat(Math.random() * 50).toFixed(6);
    try {
      const receipt = await martketContract.listNFT(
        collection.address,
        index,
        ethers.parseEther(price.toString())
      );
      await receipt.wait();
      await new Promise((resolve) => setTimeout(resolve, 1));
    } catch (error) {
      console.log(error);
    }
  }
  return;
}

module.exports = { initiateValueNFT };
