const { convertToPool } = require("../utils/convertToPool");
const Pool = require("../models/Pool");
const Token = require("../models/Token");
const WalletController = require("./WalletController");
const LiquidityTransaction = require("../models/LiquidityTransaction");
const TokenTransaction = require("../models/TokenTransaction");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const TokenController = require("./TokenController");

class PoolController {
  async updatePool(req, res) {
    try {
      const newPools = await WalletController.getPools();

      console.log(newPools);
      if (!Array.isArray(newPools)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of pools objects.",
        });
      }

      const validPool = [];
      const errors = [];

      await Promise.all(
        newPools.map(async (pool) => {
          const token1 = await Token.findOne({ address: pool.addressToken1 });
          const token2 = await Token.findOne({ address: pool.addressToken2 });

          if (!token1 || !token2) {
            errors.push({ pool, error: "Token not existed" });
            return;
          }

          if (!pool.name || !pool.address || !pool.addressLPT) {
            errors.push({ pool, error: "Missing required fields" });
            return;
          }

          // Kiểm tra tồn tại của pool chưa
          let existPool = await Pool.findOne({
            name: pool.name,
            address: pool.address,
          });
          if (existPool) {
            errors.push({
              pool,
              error: "Pool with this name already exists",
            });
            return;
          }

          let newPool = {
            name: pool.name,
            address: pool.address,
            address_lpt: pool.addressLPT,
            token1_id: token1._id,
            token2_id: token2._id,
          };
          validPool.push(newPool);
        })
      );

      const pools = await Pool.find({ deleted: true });
      if (newPools.length === pools.length && validPool.length <= 0) {
        return res.status(200).json({
          message: "All pools has updated",
          errors,
        });
      }

      const results = await Pool.insertMany(validPool);

      return res.status(200).json({
        message: "Pool data added successfully",
        data: mutipleMongooseToObject(results),
      });
    } catch (error) {
      console.error("Error pool:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updatePoolVolume(_id) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      const volumes = await TokenTransaction.aggregate([
        {
          $match: {
            pool_id: _id,
            type: { $in: ["Swap Token", "Buy Token", "Sell Token"] },
            status: "Completed",
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $project: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            price: { $toDouble: "$price" },
            type: 1,
            status: 1,
          },
        },
        {
          $group: {
            _id: { day: "$day" },
            total_price: { $sum: "$price" },
          },
        },
        {
          $project: {
            date: "$_id.day",
            volume: "$total_price",
            _id: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);

      await Pool.findByIdAndUpdate(_id, {
        volume_day: volumes.length ? volumes[volumes.length - 1].volume : 0,
        volume_week: volumes.length
          ? volumes.reduce((sum, item) => sum + item.volume, 0)
          : 0,
      });

      return;
    } catch (error) {
      console.error("Error Pool:", error.message);
      return;
    }
  }

  async updatePoolTVL(_id) {
    try {
      const tvls = await LiquidityTransaction.aggregate([
        {
          $match: {
            pool_id: _id,
            status: "Completed",
          },
        },
        {
          $project: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            price: { $toDouble: "$price" },
            type: 1,
          },
        },
        {
          $group: {
            _id: { date: "$date" },
            total_tvl: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "Add Liquidity"] },
                  "$price",
                  { $multiply: ["$price", -1] },
                ],
              },
            },
          },
        },
        {
          $project: {
            date: "$_id.date",
            tvl: "$total_tvl",
            _id: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);

      await Pool.findByIdAndUpdate(_id, {
        tvl_day: tvls.length ? tvls[tvls.length - 1].tvl : 0,
        total_tvl: tvls.length
          ? tvls.reduce((sum, item) => sum + item.tvl, 0)
          : 0,
      });

      return;
    } catch (error) {
      console.error("Error Pool:", error.message);
      return;
    }
  }

  async getPoolAll(req, res) {
    try {
      const results = await Pool.find({ active: true })
        .select(
          "_id name address address_lpt total_tvl tvl_day volume_day volume_week"
        )
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
      if (!results.length) {
        return res.status(404).json({ message: "Pool is null" });
      }
      const response = await convertToPool(results);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error Pool:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all Pool" });
    }
  }

  async getPoolSuspended(req, res) {
    try {
      const results = await Pool.find({ active: false })
        .select(
          "_id name address address_lpt total_tvl tvl_day volume_day volume_week"
        )
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
      if (!results.length) {
        return res.status(404).json({ message: "Pool is null" });
      }
      const response = await convertToPool(results);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error Pool:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all Pool" });
    }
  }

  async deletePool(req, res) {
    try {
      const { _id } = req.body;
      const pool = await Pool.findById(_id);
      if (!pool) {
        return res.status(404).json({ message: "Pool is null" });
      }
      await Pool.findByIdAndUpdate(_id, { active: false });
      return res.status(200).json({ message: "Deleted Pool" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Pool" });
    }
  }

  async activePool(req, res) {
    try {
      const { _id } = req.body;
      const pool = await Pool.findById(_id);
      if (!pool) {
        return res.status(404).json({ message: "Pool is null" });
      }
      await Pool.findByIdAndUpdate(_id, { active: true });
      return res.status(200).json({ message: "Active Pool" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Pool" });
    }
  }

  async createPool(req, res) {
    try {
      const { token1, token2 } = req.body;
      const existPool = await Pool.findOne({
        $or: [
          { token1_id: token1._id, token2_id: token2._id },
          { token1_id: token2._id, token2_id: token1._id },
        ],
      });
      if (existPool) {
        return res.status(404).json({ message: "Pool has existed!" });
      }
      const hash = await WalletController.createPool(req.body);
      console.log(hash);
      return res.status(200).json({
        message: "Pool created successfully",
        data: hash,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Token" });
    }
  }
}

module.exports = new PoolController();
