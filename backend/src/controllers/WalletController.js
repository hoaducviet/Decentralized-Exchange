const fs = require("fs");
const ethers = require("ethers");

const { fetchDataURI } = require("../utils/fetchDataURI");
const { convertToHttps } = require("../utils/convertToHttps");
const { convertToPool } = require("../utils/convertToPool");

const FactoryToken = require("../artifacts/FactoryToken.json");
const FactoryLiquidityPool = require("../artifacts/FactoryLiquidityPool.json");
const MarketNFT = require("../artifacts/MarketNFT.json");

const TokenERC20 = require("../artifacts/TokenERC20.json");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const LPToken = require("../artifacts/LPToken.json");
const NFTCollection = require("../artifacts/NFTCollection.json");

const addressFactoryToken = process.env.ADDRESS_FACTORY_TOKEN;
const addressFactoryLiquidityPool = process.env.ADDRESS_FACTORY_LIQUIDITYPOOL;
const addressMarketNFT = process.env.ADDRESS_MARKET_NFT;

const eth = require("../assets/eth.json");
const Token = require("../models/Token");
const Pool = require("../models/Pool");
const Collection = require("../models/Collection");

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

const MarketNFTContract = new ethers.Contract(
  addressMarketNFT,
  MarketNFT.abi,
  wallet
);
class WalletController {
  async getTokens() {
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

      return tokens;
    } catch (error) {
      console.log(error);
    }
  }

  async getPools() {
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
      fs.writeFile("./src/assets/pools.json", jsonData, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          console.log("File has been written");
        }
      });

      return pools;
    } catch (error) {
      console.log(error);
    }
  }

  async getCollections() {
    try {
      const results = await MarketNFTContract.getAllActiveCollection();

      const collections = await Promise.all(
        results.map(async (item) => {
          if (item[2]) {
            const response = await fetchDataURI({ uri: item[2] });

            return {
              name: response.name,
              symbol: response.symbol,
              logo: response.collection_logo,
              banner: response.collection_banner_image,
              uri: item[2],
              verified: response.verified_collection,
              address: item[0],
              owner: item[1],
            };
          }
        })
      );

      const jsonData = JSON.stringify(collections, null, 2); // Định dạng
      // Ghi dữ liệu ra file JSON
      fs.writeFile("./src/assets/collections.json", jsonData, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          console.log("File has been written");
        }
      });

      return collections;
    } catch (error) {
      console.log(error);
    }
  }

  async getCollection(req, res) {
    const { address, addressCollection } = req.query;
    try {
      if (!addressCollection) {
        return res.status(404).json("404 Not Found");
      }
      const CollectionContract = new ethers.Contract(
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
              address: addressCollection,
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

  async getNFTBalances(req, res) {
    const address = req.query.address;
    if (!address) return [];
    const collections = await Collection.find();
    try {
      const nftBalances = await Promise.allSettled(
        collections.map(async (collection) => {
          try {
            const contract = new ethers.Contract(
              collection.address,
              NFTCollection.abi,
              wallet
            );
            const number = Number(await contract.balanceOf(address));
            if (number > 0) {
              const allResults = await contract.getAllNFTInfo();
              const results = allResults.slice(1);
              if (results.length > 0) {
                const nfts = await Promise.all(
                  results.map(async (result) => {
                    if (result[4] === address && !!result[2]) {
                      const response = await fetchDataURI({ uri: result[2] });
                      const img = response.image
                        ? await convertToHttps({ uri: response.image })
                        : "";
                      const formatted = ethers.formatEther(result[1]);
                      return {
                        address: collection.address,
                        id: Number(result[0]),
                        price: Number(result[1]),
                        uri: result[2],
                        isListed: result[3],
                        owner: result[4],
                        formatted: formatted.slice(
                          0,
                          formatted.indexOf(".") + 7
                        ),
                        img: img,
                        name: response.name,
                        description: response.description,
                      };
                    }
                  })
                );
                return nfts.length > 0 ? nfts : null;
              }
            }
          } catch (error) {
            console.log(error);
          }
        })
      );
      const filteredNFTs = nftBalances
        .filter((result) => result.status === "fulfilled") // Lấy các phần tử "fulfilled"
        .map((result) => result.value) // Trích xuất giá trị `value` (mảng NFT) từ từng phần tử
        .flat() // Gộp tất cả các mảng NFT con lại thành một mảng duy nhất
        .filter(Boolean); // Lọc bỏ

      return res.status(200).json(filteredNFTs);
    } catch (error) {
      console.log(error);
    }
  }

  async getTokenBalances(req, res) {
    const address = req.query.address;
    if (!address) return [];
    const tokens = await Token.find().select(
      "_id name symbol img decimals address owner volume"
    );
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
    const results = await Pool.find()
      .select("_id name address address_lpt total_liquidity volume")
      .populate({
        path: "token1_id",
        select: "_id name symbol img decimals address owner volume",
        model: "token",
      })
      .populate({
        path: "token2_id",
        select: "_id name symbol img decimals address owner volume",
        model: "token",
      })
      .exec();

    const pools = await convertToPool(results);

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
            return {
              info: pool,
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
    const results = await Pool.find()
      .select("_id name address address_lpt total_liquidity volume")
      .populate({
        path: "token1_id",
        select: "_id name symbol img decimals address owner volume",
        model: "token",
      })
      .populate({
        path: "token2_id",
        select: "_id name symbol img decimals address owner volume",
        model: "token",
      })
      .exec();

    const pools = await convertToPool(results);
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
            const reserve1 = ethers.formatUnits(value1, pool.token1.decimals);
            const reserve2 = ethers.formatUnits(value2, pool.token2.decimals2);

            return {
              reserve1,
              reserve2,
              info: pool,
            };
          } catch (error) {
            console.error(`Error processing pool ${pool.name}:`, error);
          }
        })
      );

      res.status(200).json(reservePools);
    } catch (error) {
      console.log(error);
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
module.exports.wallet = wallet;
