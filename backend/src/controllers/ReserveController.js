const ethers = require("ethers");
const Reserve = require("../models/Reserve");
const Pool = require("../models/Pool");
const Token = require("../models/Token");
const TokenPrice = require("../models/TokenPrice");
const { wallet } = require("./WalletController.js");
const convertToPool = require("../utils/convertToPool.js");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class ReserveController {
  async updateReserve(req, res) {
    const pools = await Pool.find()
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
    try {
      const reserves = await Promise.all(
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
            const reserve1 = ethers.formatUnits(
              value1,
              pool.token1_id.decimals
            );
            const reserve2 = ethers.formatUnits(
              value2,
              pool.token2_id.decimals
            );

            return {
              reserve_token1: reserve1,
              reserve_token2: reserve2,
              pool_id: pool._id,
            };
          } catch (error) {
            console.error(`Error processing pool ${pool.name}:`, error);
          }
        })
      );
      const results = await Reserve.insertMany(reserves);

      const usd = await Token.findOne({ symbol: "USD" });
      await TokenPrice({
        token_id: usd._id,
        price: "1",
      }).save();

      res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.log(error);
    }
  }
  async getReserveAll(req, res) {
    try {
      const results = await Reserve.aggregate([
        { $sort: { pool_id: 1, createdAt: -1 } },
        {
          $group: {
            _id: "$pool_id",
            reserve_token1: { $first: "$reserve_token1" },
            reserve_token2: { $first: "$reserve_token2" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "pools", // Từ bảng pools
            localField: "_id", // Khớp với _id của Reserve
            foreignField: "_id", // Khớp với _id của pool trong bảng pools
            as: "info", // Ghi vào trường pool_info
          },
        },
        {
          $unwind: "$info",
        },
        {
          $lookup: {
            from: "tokens",
            localField: "info.token1_id",
            foreignField: "_id",
            as: "info.token1",
          },
        },
        {
          $unwind: "$info.token1",
        },
        {
          $lookup: {
            from: "tokens",
            localField: "info.token2_id",
            foreignField: "_id",
            as: "info.token2",
          },
        },
        {
          $unwind: "$info.token2",
        },
        {
          $project: {
            _id: 0,
            pool_id: "$_id",
            reserve1: "$reserve_token1",
            reserve2: "$reserve_token2",
            info: {
              _id: 1,
              name: 1,
              address: 1,
              address_lpt: 1,
              token1: {
                _id: 1,
                name: 1,
                symbol: 1,
                img: 1,
                decimals: 1,
                address: 1,
                owner: 1,
                volume: 1,
              },
              token2: {
                _id: 1,
                name: 1,
                symbol: 1,
                img: 1,
                decimals: 1,
                address: 1,
                owner: 1,
                volume: 1,
              },
              total_liquidity: 1,
              volume: 1,
            },
            createdAt: 1,
          },
        },
      ]);

      return res.status(200).json(results);
    } catch (error) {
      console.log(error);
    }
  }
  async getReserveByPool(req, res) {
    try {
      const { id } = req.params;
      const results = await Reserve.find({ pool_id: id });

      if (!results.length) {
        return res.status(404).json({ message: "Pool is null" });
      }
      const response = results.map((item) => ({
        _id: item._id,
        pool_id: item.pool_id,
        reserve1: item.reserve_token1,
        reserve2: item.reserve_token2,
        createdAt: item.createdAt,
      }));
      response.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      console.log(response);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteReserveById(req, res) {}
}

module.exports = new ReserveController();
