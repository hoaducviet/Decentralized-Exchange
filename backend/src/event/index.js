const { ethers } = require("ethers");
const Pool = require("../models/Pool");
const NFT = require("../models/NFT");
const Collection = require("../models/Collection");
const Reserve = require("../models/Reserve");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const CollectionController = require("../controllers/CollectionController");
const PendingCollection = require("../models/PendingCollection");

const eventAbi = [
  "event LiquidityAdded( address indexed provider, uint256 amount1, uint256 amount2, uint256 liquidityTokens)",
  "event LiquidityRemoved( address indexed provider, uint256 amount1, uint256 amount2, uint256 liquidityTokens)",
  "event TokensSwapped( address indexed provider, address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut)",
];

const eventTopics = eventAbi.map(
  (abi) => ethers.EventFragment.from(abi).topicHash
);

const eventNftAbi = [
  "event NFTBought( address collection, address to, uint256 tokenId, uint256 price)",
  "event NFTTransfer(address collection, address from,address to, uint256 nftId)",
  "event NFTListed(address collection, address from, uint256 tokenId, uint256 price)",
  "event NFTListedRemove(address collection, address owner, uint256 tokenId)",
  "event PayedFeeExpert(address from, string idCollection, uint256 value)",
  "event PayedFeeCollection(address from, string idCollection, uint256 value)",
];

const eventNftTopics = eventNftAbi.map(
  (abi) => ethers.EventFragment.from(abi).topicHash
);

const addressMarketNft = process.env.ADDRESS_MARKET_NFT;
async function addReserves(log, provider) {
  const pool = await Pool.findOne({ address: log.address })
    .select("_id name address")
    .populate({
      path: "token1_id",
      select: "_id decimals",
      model: "token",
    })
    .populate({
      path: "token2_id",
      select: "_id decimals",
      model: "token",
    })
    .exec();

  const contract = new ethers.Contract(
    log.address,
    LiquidityPool.abi,
    provider
  );
  const value1 = await contract.reserve1();
  const value2 = await contract.reserve2();
  const reserve1 = ethers.formatUnits(value1, pool.token1_id.decimals);
  const reserve2 = ethers.formatUnits(value2, pool.token2_id.decimals);

  await new Reserve({
    pool_id: pool._id,
    reserve_token1: reserve1,
    reserve_token2: reserve2,
  }).save();
}

async function addNewPriceNft(log) {
  if (eventNftTopics[0] === log.topics[0]) {
    try {
      const [collection, to, tokenId, price] =
        ethers.AbiCoder.defaultAbiCoder().decode(
          ["address", "address", "uint256", "uint256"],
          log.data
        );
      const newCollection = await Collection.findOne({
        address: collection,
      });

      const result = await NFT.findOneAndUpdate(
        {
          collection_id: newCollection._id,
          nft_id: tokenId.toString(),
        },
        {
          owner: to,
          price: price.toString(),
          formmated: ethers.formatEther(price),
          isListed: false,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!result) {
        console.log("Không tìm thấy NFT để cập nhật", {
          collection_id: newCollection._id,
        });
        return;
      }

      await CollectionController.updateInfoCollection(result.collection_id);
      return;
    } catch (error) {
      console.log(error);
    }
  }
  if (eventNftTopics[1] === log.topics[0]) {
    try {
      const [collection, from, to, nftId] =
        ethers.AbiCoder.defaultAbiCoder().decode(
          ["address", "address", "address", "uint256"],
          log.data
        );

      const newCollection = await Collection.findOne({
        address: collection,
      });

      const result = await NFT.findOneAndUpdate(
        {
          collection_id: newCollection._id,
          owner: from,
          nft_id: nftId.toString(),
        },
        {
          owner: to,
          isListed: false,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!result) {
        console.log("Không tìm thấy NFT để cập nhật", {
          collection_id: newCollection._id,
        });
        return;
      }

      await CollectionController.updateInfoCollection(result.collection_id);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  if (eventNftTopics[2] === log.topics[0]) {
    try {
      const [collection, from, tokenId, price] =
        ethers.AbiCoder.defaultAbiCoder().decode(
          ["address", "address", "uint256", "uint256"],
          log.data
        );

      const newCollection = await Collection.findOne({
        address: collection,
      });

      const result = await NFT.findOneAndUpdate(
        {
          collection_id: newCollection._id,
          owner: from,
          nft_id: tokenId.toString(),
        },
        {
          price: price.toString(),
          formatted: ethers.formatEther(price),
          isListed: true,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!result) {
        console.log("Không tìm thấy NFT để cập nhật", {
          collection_id: newCollection._id,
          nft_id: tokenId.toString(),
        });
        return;
      }

      await CollectionController.updateInfoCollection(result.collection_id);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (eventNftTopics[3] === log.topics[0]) {
    try {
      const [collection, owner, tokenId] =
        ethers.AbiCoder.defaultAbiCoder().decode(
          ["address", "address", "uint256"],
          log.data
        );
      const newCollection = await Collection.findOne({
        address: collection,
      });
      const result = await NFT.findOneAndUpdate(
        {
          collection_id: newCollection._id,
          owner: owner,
          nft_id: tokenId.toString(),
        },
        {
          isListed: false,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!result) {
        console.log("Không tìm thấy NFT để cập nhật", {
          collection_id: newCollection._id,
          nft_id: tokenId.toString(),
        });
        return;
      }

      await CollectionController.updateInfoCollection(result.collection_id);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (eventNftTopics[4] === log.topics[0]) {
    try {
      const [from, idCollection, value] =
        ethers.AbiCoder.defaultAbiCoder().decode(
          ["address", "string", "uint256"],
          log.data
        );

      const newCollection = await PendingCollection.findByIdAndUpdate(
        idCollection,
        {
          payment_expert: ethers.formatEther(value),
          user_status: "Pending Expert",
        },
        { new: true }
      );

      console.log(newCollection);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (eventNftTopics[5] === log.topics[0]) {
    try {
      const [from, idCollection, value] =
        ethers.AbiCoder.defaultAbiCoder().decode(
          ["address", "string", "uint256"],
          log.data
        );

      const newCollection = await PendingCollection.findByIdAndUpdate(
        idCollection,
        {
          payment_fee: ethers.formatEther(value),
          user_status: "Payed Fee",
        },
        { new: true }
      );

      console.log(newCollection);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  return;
}

async function event(wsProvider) {
  const pools = await Pool.find().select("_id address").exec();
  const addressLiquiditys = pools.map((item) => item.address);

  const filter = {
    address: addressLiquiditys,
    topics: [eventTopics],
  };

  const filterNft = {
    address: addressMarketNft,
    topics: [eventNftTopics],
  };

  wsProvider.on(filter, (log, event) => {
    addReserves(log, wsProvider);
  });

  wsProvider.on(filterNft, (log, event) => {
    addNewPriceNft(log);
  });
}

module.exports = event;
