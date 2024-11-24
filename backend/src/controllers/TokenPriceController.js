const ethers = require("ethers");
const Reserve = require("../models/Reserve");
const Pool = require("../models/Pool");
const TokenPrice = require("../models/TokenPrice.js");
const { wallet } = require("./WalletController.js");

const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class TokenPriceController {
  async addTokenPrice(data) {
    try {
      const { pool_id, reserve1, reserve2 } = data;
      const usdUsdt = (
        await Reserve.aggregate([
          {
            $lookup: {
              from: "pools",
              localField: "pool_id",
              foreignField: "_id",
              as: "pool_id",
            },
          },
          { $unwind: "$pool_id" },
          {
            $match: {
              "pool_id.name": { $regex: /^(USDT\/USD|USD\/USDT)$/i },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ])
      )[0];
      const USDTprice =
        usdUsdt.pool_id.name === "USD/USDT"
          ? parseFloat(usdUsdt.reserve_token1) /
            parseFloat(usdUsdt.reserve_token2)
          : parseFloat(usdUsdt.reserve_token2) /
            parseFloat(usdUsdt.reserve_token1);
      const pool = await Pool.findById(pool_id);
      if (pool.name.includes("USDT") || pool.name.includes("ETH")) {
        if (pool.name === "USDT/USD") {
          const newTokenPrice = new TokenPrice({
            token_id: pool.token1_id,
            price: (parseFloat(reserve2) / parseFloat(reserve1)).toString(),
          });
          await newTokenPrice.save();
          return;
        }
        if (["USD/USDT", "USD/ETH"].includes(pool.name)) {
          const newTokenPrice = new TokenPrice({
            token_id: pool.token2_id,
            price: (parseFloat(reserve1) / parseFloat(reserve2)).toString(),
          });
          await newTokenPrice.save();
          return;
        }
        if (pool.name.startsWith("USDT/")) {
          if (pool.name === "USDT/ETH") {
            return;
          }
          const newTokenPrice = new TokenPrice({
            token_id: pool.token2_id,
            price: (
              (parseFloat(reserve1) / parseFloat(reserve2)) *
              USDTprice
            ).toString(),
          });
          await newTokenPrice.save();
          return;
        }
        const newTokenPrice = new TokenPrice({
          token_id: pool.token1_id,
          price: (
            (parseFloat(reserve2) / parseFloat(reserve1)) *
            USDTprice
          ).toString(),
        });
        await newTokenPrice.save();
        return;
      }
      console.log("NOT have USDT");
      return;
    } catch (error) {
      console.log(error);
    }
  }
  async getTokenPriceAll(req, res) {
    try {
      const results = await TokenPrice.aggregate([
        { $sort: { token_id: 1, createdAt: -1 } },
        {
          $group: {
            _id: "$token_id",
            price: { $first: "$price" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "tokens", // Từ bảng pools
            localField: "_id", // Khớp với _id của Reserve
            foreignField: "_id", // Khớp với _id của pool trong bảng pools
            as: "info", // Ghi vào trường pool_info
          },
        },
        {
          $unwind: "$info",
        },
        {
          $project: {
            _id: "$_id",
            price: "$price",
            name: "$info.name",
            symbol: "$info.symbol",
            img: "$info.img",
            decimals: "$info.decimals",
            address: "$info.address",
            owner: "$info.owner",
            volume: "$info.volume",
            createdAt: 1,
          },
        },
      ]);

      return res.status(200).json(results);
    } catch (error) {
      console.log(error);
    }
  }

  async getTokenPrice(req, res) {
    try {
      const { id } = req.params;
      const prices = await TokenPrice.find({ token_id: id }).select(
        "token_id price createdAt"
      );
      prices.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return res.status(200).json(mutipleMongooseToObject(prices));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TokenPriceController();
