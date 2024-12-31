const { ethers } = require("hardhat");
const addresses = require("../ignition/deployments/chain-31337/deployed_addresses.json");

async function initiateValueNFT(nfts, collection) {
  const accounts = await hre.network.provider.send("eth_accounts", []);
  const contract = await ethers.getContractAt(
    "FactoryNFT",
    addresses["FactoryNFT#FactoryNFT"]
  );

  for (let index = 0; index < nfts.length; index++) {
    const { token_uri } = nfts[index];
    const price = parseFloat(Math.random() * 50).toFixed(6);
    try {
      const receipt = await contract.mintNFT(
        collection.address,
        token_uri,
        accounts[0],
        ethers.parseEther(price.toString())
      );
      await receipt.wait();

      await new Promise((resolve) => setTimeout(resolve, 1));
    } catch (error) {
      console.log(`Error minting NFT #${index}:`, error);
    }
  }

  return;
}

module.exports = { initiateValueNFT };
