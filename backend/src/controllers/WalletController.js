const ethers = require("ethers");

const FactoryToken = require("../artifacts/FactoryToken.json");
const FactoryLiquidityPool = require("../artifacts/FactoryLiquidityPool.json");
const addressFactoryToken = process.env.ADDRESS_FACTORY_TOKEN;
const addressFactoryLiquidityPool = process.env.ADDRESS_FACTORY_LIQUIDITYPOOL;
const addressNFTMarket = process.env.ADDRESS_NFT_MARKET;

const pools = require("../assets/pool.json");
const tokens = require("../assets/token.json");

const networkUrl = process.env.NETWORK_URL;
const privateKey = process.env.PRIVATE_KEY_ADDRESS;
const provider = new ethers.JsonRpcProvider(networkUrl);

const wallet = new ethers.Wallet(privateKey, provider);

const FactoryTokenContract = new ethers.Contract(
  addressFactoryToken,
  FactoryToken.abi,
  wallet
);

class WalletController {
  async checkWallet() {
    try {
      console.log("Checking");
      console.log(wallet);
      const result = await FactoryTokenContract.getAllTokens();
      return result;
    } catch (error) {
      return console.log({ message: "Internal server error" });
    }
  }

  async depositUSD(address, value) {
    try {
      const amount = ethers.parseUnits(value, 6);
      const receipt = await FactoryTokenContract.mintUSD(address, amount);
      await receipt.wait();
      return receipt;
    } catch (error) {
      return console.log(error);
    }
  }
  async withdrawUSD(address, value) {
    try {
      const amount = ethers.parseUnits(value, 6);
      const receipt = await FactoryTokenContract.burnUSD(address, amount);
      await receipt.wait();
      return receipt;
    } catch (error) {
      return console.log(error);
    }
  }
}

module.exports = new WalletController();
