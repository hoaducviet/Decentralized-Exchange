const fs = require("fs");
const ethers = require("ethers");

const { fetchDataURI } = require("../utils/fetchDataURI");
const { chunkArray } = require("../utils/chunkArray");
const { convertToHttps } = require("../utils/convertToHttps");
const { convertToPool } = require("../utils/convertToPool");

const FactoryToken = require("../artifacts/FactoryToken.json");
const FactoryNFT = require("../artifacts/FactoryNFT.json");
const FactoryLiquidityPool = require("../artifacts/FactoryLiquidityPool.json");
const MarketNFT = require("../artifacts/MarketNFT.json");

const TokenERC20 = require("../artifacts/TokenERC20.json");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const LPToken = require("../artifacts/LPToken.json");
const NFTCollection = require("../artifacts/NFTCollection.json");

const addressFactoryToken = process.env.ADDRESS_FACTORY_TOKEN;
const addressFactoryNFT = process.env.ADDRESS_FACTORY_NFT;
const addressFactoryLiquidityPool = process.env.ADDRESS_FACTORY_LIQUIDITYPOOL;
const addressMarketNFT = process.env.ADDRESS_MARKET_NFT;

const eth = require("../assets/eth.json");
const Token = require("../models/Token");
const TokenPrice = require("../models/TokenPrice");
const Pool = require("../models/Pool");
const NFT = require("../models/NFT");
const Collection = require("../models/Collection");
const { getNonce } = require("../utils/getNonce");

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

const FactoryNFTContract = new ethers.Contract(
  addressFactoryNFT,
  FactoryNFT.abi,
  wallet
);

const ipfsGateway = process.env.IPFSLINK;

class WalletController {
  async getTokens() {
    try {
      const allTokens = await FactoryTokenContract.getAllTokens();
      const allTokensData = await Promise.all(
        allTokens.map(async (item) => {
          const erc20 = new ethers.Contract(item[5], TokenERC20.abi, wallet);
          const supply = await erc20.totalSupply();
          const decimals = Number(item[3]);
          return {
            name: item[0],
            symbol: item[1],
            img: item[2],
            decimals,
            owner: item[4],
            address: item[5],
            total_supply: ethers.formatUnits(supply, decimals),
            active: true,
          };
        })
      );
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
              address: item[0],
              owner: item[1],
              uri: item[2],
              name: response.name,
              symbol: response.symbol,
              logo: response.collection_logo,
              banner: response.collection_banner_image,
              verified: response.verified_collection,
              project_url: response.project_url || "",
              discord_url: response.discord_url || "",
              twitter_username: response.twitter_username || "",
              instagram_username: response.instagram_username || "",
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

  async getNFTAll() {
    const excludedName = [
      // "Nyan Balloon", //0
      // "Pirate Nation - Founder's Pirate", //1
      // "Mutan Ape Yacht Club", //1
      // "Fijis", //1
      // "Cool Cats", //1
      // "CloneX - X TAKASHI MURAKAMI", //1
      // "Captainz", //0
      // "Block Queens by Jeremy Cowart", //1
      // "Bored Ape Yacht Club",
      // "Doodles",
      // "RumbleKongLeague",
    ];
    const collections = await Collection.find({
      name: { $nin: excludedName },
    });
    try {
      const nfts = await Promise.allSettled(
        collections.map(async (collection) => {
          try {
            const contract = new ethers.Contract(
              collection.address,
              NFTCollection.abi,
              wallet
            );

            const counter = await contract.counter();
            const promises = [];
            const saved = (
              await NFT.find({
                collection_id: collection._id,
              })
            ).map((item) => Number(item.nft_id));

            for (let index = 0; index < Number(counter); index++) {
              if (!saved.includes(index)) {
                promises.push(contract.getNFTInfo(index));
              }
            }
            const results = await Promise.all(promises);

            const nftsCollection = [];
            if (results.length > 0) {
              const nftPromises = results.map(async (result, index) => {
                if (result[2]) {
                  console.log(collection.name, "index", index);
                  const response = await fetchDataURI({ uri: result[2] });
                  const img = response.image
                    ? await convertToHttps({ uri: response.image })
                    : "";
                  const formatted = ethers.formatEther(result[1]);
                  return {
                    collection_id: collection._id,
                    owner: result[4],
                    nft_id: result[0].toString(),
                    name: response.name || "",
                    uri: result[2],
                    img: img || `${index}`,
                    price: result[1].toString(),
                    formatted,
                    isListed: result[3],
                    description: response.description || "",
                    attributes: response.attributes || [],
                  };
                }
              });

              const chunkSize = 10;
              const nftChunks = chunkArray(nftPromises.slice(0, 20), chunkSize);
              let index = 0;
              for (const chunk of nftChunks) {
                const resultsChunk = await Promise.all(chunk);
                console.log(index++);
                await new Promise((resolve) => setTimeout(resolve, 100));
                nftsCollection.push(...resultsChunk.filter(Boolean));
              }
            }

            await new Promise((resolve) => setTimeout(resolve, 10));
            return nftsCollection.length > 0 ? nftsCollection : null;
          } catch (error) {
            console.log(error);
          }
        })
      );
      const filteredNFTs = nfts
        .filter((result) => result.status === "fulfilled") // Lấy các phần tử "fulfilled"
        .map((result) => result.value) // Trích xuất giá trị `value` (mảng NFT) từ từng phần tử
        .flat() // Gộp tất cả các mảng NFT con lại thành một mảng duy nhất
        .filter(Boolean);

      return filteredNFTs;
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
            const counter = Number(await contract.counter());
            if (number > 0) {
              const list = [];
              const results = [];
              for (let i = 0; i < counter; i++) {
                const owner = await contract.ownerOf(i);
                if (owner === address) {
                  list.push(i);
                }
              }
              for (let i = 0; i < list.length; i++) {
                const result = await contract.getNFTInfo(i);
                results.push(result);
              }
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
                        collection_id: collection._id,
                        owner: result[4],
                        nft_id: result[0].toString(),
                        name: response.name,
                        uri: result[2],
                        img,
                        price: result[1].toString(),
                        formatted: formatted.slice(
                          0,
                          formatted.indexOf(".") + 7
                        ),
                        isListed: result[3],
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
            const total_supply = await contract.totalSupply();
            const balance = {
              value: value.toString(),
              total_supply: ethers.formatUnits(total_supply, decimals),
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

  async createToken(newToken) {
    try {
      const { name, symbol, img, decimals, owner, total_supply } = newToken;

      const amount = ethers.parseUnits(total_supply, decimals);
      const nonce = await getNonce();
      const receipt = await FactoryTokenContract.createToken(
        name,
        symbol,
        img,
        decimals,
        owner,
        amount,
        {
          nonce,
        }
      );
      await receipt.wait();
      return receipt.hash;
    } catch (error) {
      return console.log(error);
    }
  }

  async createPool(newPool) {
    try {
      const { token1, token2 } = newPool;
      const isEth = token1.symbol === "ETH" || token2 === "ETH";
      const nonce = await getNonce();
      const receipt = isEth
        ? await FactoryLiquidityPoolContract.createLiquidityPoolETH(
            token1.symbol === "ETH" ? token2.address : token1.address,
            {
              nonce,
            }
          )
        : await FactoryLiquidityPoolContract.createLiquidityPool(
            token1.address,
            token2.address,
            {
              nonce,
            }
          );
      await receipt.wait();
      return receipt.hash;
    } catch (error) {
      return console.log(error);
    }
  }

  async addToken(newToken) {
    try {
      const { img, address } = newToken;

      const nonce = await getNonce();
      const receipt = await FactoryTokenContract.addToken(img, address, {
        nonce,
      });
      await receipt.wait();
      return receipt.hash;
    } catch (error) {
      return console.log(error);
    }
  }

  async depositUSD(address, value, percent) {
    try {
      const eth = await Token.findOne({ symbol: "ETH" });
      const ethPrice = await TokenPrice.findOne({ token_id: eth._id })
        .sort({ createdAt: -1 })
        .limit(1);

      const valueUsd = (
        parseFloat(value) *
        (1 - parseFloat(percent))
      ).toString();
      const valueEth = (
        (parseFloat(value) * parseFloat(percent)) /
        parseFloat(ethPrice.price)
      )
        .toFixed(18)
        .toString();

      const amount = ethers.parseUnits(valueUsd, 6);
      const receipt = await FactoryTokenContract.mintUSD(address, amount, {
        value: ethers.parseEther(valueEth),
      });
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

  async mintCollectionAndAddNFT(collection, nfts) {
    try {
      const receipt = await FactoryNFTContract.createCollection(
        collection.name,
        collection.symbol,
        collection.uri,
        collection.base_url
      );
      await receipt.wait();
      const counter = await FactoryNFTContract.counter();
      const newCollection = await FactoryNFTContract.InfoCollections(
        counter - 1n
      );
      const addReceipt = await MarketNFTContract.addCollection(
        newCollection[0],
        {
          value: ethers.parseEther("1"),
        }
      );
      await addReceipt.wait();
      for (let index = 0; index < nfts.length; index++) {
        const { uri, price } = nfts[index];
        try {
          const tx = await FactoryNFTContract.mintNFT(
            newCollection[0],
            uri,
            collection.owner,
            ethers.parseEther(price)
          );
          await tx.wait();

          await new Promise((resolve) => setTimeout(resolve, 1));
        } catch (error) {
          console.log(`Error minting NFT #${index}:`, error);
        }
      }

      const txTransferOwner = await FactoryNFTContract.transferOwnerCollection(
        newCollection[0],
        collection.owner
      );
      await txTransferOwner.wait();

      return txTransferOwner.hash;
    } catch (error) {
      return console.log(error);
    }
  }
}

module.exports = new WalletController();
module.exports.wallet = wallet;
