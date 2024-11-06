const { movies } = require("../data/index.js");

const TokenTransaction = require("../models/TokenTransaction");
const LiquidityTransaction = require("../models/LiquidityTransaction");
const NftTransaction = require("../models/NftTransaction");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class TransactionController {
  async addTokenTransaction(req, res) {
    try {
      const newTransaction = req.body;
      if (
        !newTransaction.type ||
        !newTransaction.from_wallet ||
        !newTransaction.from_token_id ||
        !newTransaction.amount_in
      ) {
        return res.status(400).json({
          message: "Missing fields.",
        });
      }

      const result = await new TokenTransaction(newTransaction).save();

      return res.status(200).json(mongooseToObject(result));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async updateTokenTransaction(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await TokenTransaction.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!result) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      return res.status(200).json(mongooseToObject(result));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async addLiquidityTransaction(req, res) {
    try {
      const newTransaction = req.body;
      if (
        !newTransaction.type ||
        !newTransaction.wallet ||
        !newTransaction.token1_id ||
        !newTransaction.token2_id 
      ) {
        return res.status(400).json({
          message: "Missing fields.",
        });
      }

      const result = await new LiquidityTransaction(newTransaction).save();

      return res.status(200).json(mongooseToObject(result));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }
  async updateLiquidityTransaction(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      console.log(id);
      console.log(updateData);
      const result = await LiquidityTransaction.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!result) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      return res.status(200).json(mongooseToObject(result));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async addNftTransaction(req, res) {}

  async getTokenTransactionAll(req, res) {}

  async getActiveTransactionByAddress(req, res) {}
}

module.exports = new TransactionController();
