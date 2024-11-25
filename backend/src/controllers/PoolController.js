const { convertToPool } = require("../utils/convertToPool");
const Pool = require("../models/Pool");
const Token = require("../models/Token");
const WalletController = require("./WalletController");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class PoolController {
  async updatePool(req, res) {
    try {
      const newPools = await WalletController.getPools();

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

      if (errors.length) {
        return res.status(400).json({
          message: "Some pool items could not be added",
          errors,
        });
      }

      const results = await Pool.insertMany(validPool);

      return res.status(201).json({
        message: "Pool data added successfully",
        data: mutipleMongooseToObject(results),
      });
    } catch (error) {
      console.error("Error pool:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getPoolAll(req, res) {
    try {
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
}

module.exports = new PoolController();
