const fs = require("fs");
const ethers = require("ethers");

const { fetchDataURI } = require("../utils/fetchDataURI");
const { convertToHttps } = require("../utils/convertToHttps");

const FactoryToken = require("../artifacts/FactoryToken.json");
const FactoryLiquidityPool = require("../artifacts/FactoryLiquidityPool.json");
const NFTMarket = require("../artifacts/NFTMarket.json");

const TokenERC20 = require("../artifacts/TokenERC20.json");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const LPToken = require("../artifacts/LPToken.json");
const NFTCollection = require("../artifacts/NFTCollection.json");

const addressFactoryToken = process.env.ADDRESS_FACTORY_TOKEN;
const addressFactoryLiquidityPool = process.env.ADDRESS_FACTORY_LIQUIDITYPOOL;
const addressNFTMarket = process.env.ADDRESS_NFT_MARKET;

const eth = require("../assets/eth.json");
const tokens = require("../assets/tokens.json");
const pools = require("../assets/pools.json");

const networkUrl = process.env.NETWORK_URL;
const privateKey = process.env.PRIVATE_KEY_ADDRESS;
const provider = new ethers.JsonRpcProvider(networkUrl);
const wallet = new ethers.Wallet(privateKey, provider);

const FactoryTokenContract = new ethers.Contract(
  addressFactoryToken,
  FactoryToken.abi,
  wallet
);

const FactoryLiquidityPoolContract = new ethers.Contract(
  addressFactoryLiquidityPool,
  FactoryLiquidityPool.abi,
  wallet
);

const NFTMarketContract = new ethers.Contract(
  addressNFTMarket,
  NFTMarket.abi,
  wallet
);
class WalletController {
  async checkWallet() {
    try {
      console.log("Checking");

      const result = await fetchDataURI("https://api.coolcatsnft.com/cat/37");
      const img = await convertToHttps(result.image);
      console.log("Image: ", img);
      return result;
    } catch (error) {
      return console.log({ message: "Internal server error" });
    }
  }

  async getTokens(req, res) {
    try {
      const allTokens = await FactoryTokenContract.getAllTokens();

      const allTokensData = allTokens.map((item) => ({
        name: item[0],
        symbol: item[1],
        img: item[2],
        decimals: Number(item[3]),
        owner: item[4],
        address: item[5],
      }));
      const tokens = [eth, ...allTokensData];

      const jsonData = JSON.stringify(tokens, null, 2); // Định dạng
      // Ghi dữ liệu ra file JSON
      fs.writeFile("./src/assets/tokens.json", jsonData, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          console.log("File has been written");
        }
      });

      return res.status(200).json(tokens);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async getPools(req, res) {
    try {
      const allPools = await FactoryLiquidityPoolContract.getAllPool();
      const allPoolsData = allPools.map((item) => ({
        name: item[0],
        address: item[1],
        addressLPT: item[2],
        decimals1: Number(item[3]),
        addressToken1: item[4],
        decimals2: Number(item[5]),
        addressToken2: item[6],
      }));
      const usdEthPool = allPoolsData.find(
        (item) => item.name === "ETH/USD" || item.name === "USD/ETH"
      );
      const usdUsdtPool = allPoolsData.find(
        (item) => item.name === "USDT/USD" || item.name === "USD/USDT"
      );
      const noUsdPool = allPoolsData.filter(
        (item) => !(item.name.startsWith("USD/") || item.name.endsWith("/USD"))
      );
      const pools = [...noUsdPool, usdEthPool, usdUsdtPool];

      const jsonData = JSON.stringify(pools, null, 2); // Định dạng
      // Ghi dữ liệu ra file JSON
      fs.writeFile("./src/assets//pools.json", jsonData, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          console.log("File has been written");
        }
      });

      return res.status(200).json(pools);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async getCollection(req, res) {
    const { address, addressCollection } = req.query;
    try {
      if (!addressCollection) {
        return res.status(404).json("404 Not Found");
      }
      const CollectionContract = await new ethers.Contract(
        addressCollection,
        NFTCollection.abi,
        wallet
      );

      const allResults = await CollectionContract.getAllNFTInfo();
      const results = allResults.slice(1);
      const nfts = await Promise.all(
        results.map(async (result) => {
          if (result[2]) {
            const response = await fetchDataURI({ uri: result[2] });
            const img = response.image
              ? await convertToHttps({ uri: response.image })
              : "";
            const formatted = ethers.formatEther(result[1]);
            return {
              id: Number(result[0]),
              price: Number(result[1]),
              uri: result[2],
              isListed: result[3],
              owner: result[4],
              formatted: formatted.slice(0, formatted.indexOf(".") + 7),
              img: img,
              name: response.name,
              description: response.description,
            };
          }
        })
      );

      const listed = nfts.filter((item) => item.isListed);
      const mylist = address
        ? nfts.filter((item) => item.owner === address)
        : [];
      return res.status(200).json({ nfts, listed, mylist });
    } catch (error) {
      console.log(error);
    }
  }

  async getCollections(req, res) {
    try {
      const allCollections = await NFTMarketContract.getAllCollection();

      const allCollectionsData = allCollections.map((item) => ({
        address: item[0],
        name: item[1],
        symbol: item[2],
      }));

      return res.status(200).json(allCollectionsData);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async getTokenBalances(req, res) {
    const address = req.query.address;
    if (!address) return [];
    try {
      const tokenBalances = await Promise.all(
        tokens.map(async (token) => {
          try {
            if (token.symbol === "ETH") {
              const ethBalance = await provider.getBalance(address);
              const ethFormatted = ethers.formatEther(ethBalance);
              const balanceFormatted = ethFormatted.slice(
                0,
                ethFormatted.indexOf(".") + 7
              );
              return {
                info: token,
                balance: {
                  value: Number(ethBalance),
                  symbol: token.symbol,
                  formatted: balanceFormatted,
                  decimals: token.decimals,
                },
              };
            }

            const contract = new ethers.Contract(
              token.address,
              TokenERC20.abi,
              wallet
            );
            const value = await contract.balanceOf(address);
            const decimals = Number(await contract.decimals());
            const formatted = ethers.formatUnits(value, decimals);
            const balanceFormatted = formatted.slice(
              0,
              formatted.indexOf(".") + 7
            );
            const symbol = await contract.symbol();
            const balance = {
              value: Number(value),
              symbol: symbol,
              formatted: balanceFormatted,
              decimals: decimals,
            };
            return {
              info: token,
              balance: balance,
            };
          } catch (error) {
            console.error(`Error processing token ${token.name}`, error);
            throw error;
          }
        })
      );
      res.status(200).json(tokenBalances);
    } catch (error) {
      console.log(error);
    }
  }
  async getLiquidityBalances(req, res) {
    const address = req.query.address;
    if (!address) return [];
    try {
      const liquidityBalances = await Promise.all(
        pools.map(async (pool) => {
          try {
            const contract = new ethers.Contract(
              pool.addressLPT,
              LPToken.abi,
              wallet
            );
            const value = await contract.balanceOf(address, {
              blockTag: "latest",
            });
            const decimals = Number(await contract.decimals());
            const formatted = ethers.formatUnits(value, decimals);
            const balanceFormatted = formatted.slice(
              0,
              formatted.indexOf(".") + 7
            );
            const symbol = await contract.symbol();
            const balance = {
              value: Number(value),
              symbol: symbol,
              formatted: balanceFormatted,
              decimals: decimals,
            };

            const token1 = tokens.find(
              (token) => token.address === pool.addressToken1
            );
            const token2 = tokens.find(
              (token) => token.address === pool.addressToken2
            );

            return {
              info: { ...pool, token1, token2 },
              balance: balance,
            };
          } catch (error) {
            console.error(`Error processing pool ${pool.name}:`, error);
            throw error;
          }
        })
      );

      res.status(200).json(liquidityBalances);
    } catch (error) {
      console.log(error);
    }
  }

  async getReservePools(req, res) {
    try {
      const reservePools = await Promise.all(
        pools.map(async (pool) => {
          const isEth = pool.name.endsWith("/ETH");
          try {
            const contract = new ethers.Contract(
              pool.address,
              isEth ? LiquidityPoolETH.abi : LiquidityPool.abi,
              wallet
            );
            const value1 = await contract.reserve1();
            const value2 = await contract.reserve2();
            const reserve1 = ethers.formatUnits(value1, pool.decimals1);
            const reserve2 = ethers.formatUnits(value2, pool.decimals2);

            const token1 = tokens.find(
              (token) => token.address === pool.addressToken1
            );
            const token2 = tokens.find(
              (token) => token.address === pool.addressToken2
            );

            return {
              reserve1,
              reserve2,
              info: { ...pool, token1, token2 },
            };
          } catch (error) {
            console.error(`Error processing pool ${pool.name}:`, error);
          }
        })
      );

      res.status(200).json(reservePools);
    } catch (error) {
      console.log(error);
      throw new Error();
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
