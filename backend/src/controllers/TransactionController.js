const ethers = require("ethers");
const TokenTransaction = require("../models/TokenTransaction");
const LiquidityTransaction = require("../models/LiquidityTransaction");
const NftTransaction = require("../models/NftTransaction");
const WalletController = require("./WalletController");
const signer = WalletController.wallet;
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const UsdTransaction = require("../models/UsdTransaction.js");
const LPToken = require("../artifacts/LPToken.json");
const Pool = require("../models/Pool.js");

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
      const { wallet, pool_id, gas_fee, receipt_hash, status } = req.body;
      const transactions = await LiquidityTransaction.find({
        wallet: wallet,
        pool_id: pool_id,
      });

      const pool = await Pool.findById(pool_id);
      const totalLpt = transactions.map((item) => {
        const amount = parseFloat(item.amount_lpt);
        if (isNaN(amount)) {
          return 0; // Bỏ qua giá trị không hợp lệ
        }
        return item.type.includes("Add") ? amount : -amount;
      });
      const sumTotalLpt = totalLpt.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      const contract = new ethers.Contract(
        pool.address_lpt,
        LPToken.abi,
        signer
      );
      const value = await contract.balanceOf(wallet, {
        blockTag: "latest",
      });

      const decimals = Number(await contract.decimals());
      const formatted = ethers.formatUnits(value, decimals);
      const result = await LiquidityTransaction.findByIdAndUpdate(
        id,
        {
          amount_lpt: (parseFloat(formatted) - sumTotalLpt).toString(),
          gas_fee,
          receipt_hash,
          status,
        },
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

  async addNftTransaction(req, res) {
    try {
      const newTransaction = req.body;
      if (
        !newTransaction.type ||
        !newTransaction.from_wallet ||
        !newTransaction.collection_id ||
        !newTransaction.nft_id
      ) {
        return res.status(400).json({
          message: "Missing fields.",
        });
      }

      const result = await new NftTransaction(newTransaction).save();

      return res.status(200).json(mongooseToObject(result));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async updateNftTransaction(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await NftTransaction.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      console.log(result);
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

  async getTokenTransactionAll(req, res) {
    try {
      const tokenTransactions = await TokenTransaction.find()
        .populate({
          path: "from_token_id",
          select: "_id name symbol img decimals address owner volume",
          model: "token",
        })
        .populate({
          path: "to_token_id",
          select: "_id name symbol img decimals address owner volume",
          model: "token",
        })
        .exec();

      tokenTransactions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return res.status(200).json(mutipleMongooseToObject(tokenTransactions));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async getActiveTransactionByAddress(req, res) {
    try {
      const { address } = req.params;
      if (!ethers.isAddress(address)) {
        return res.status(400).json({
          message: "Invalid address.",
        });
      }
      const tokenTransactions = await TokenTransaction.find({
        from_wallet: address,
      })
        .populate({
          path: "from_token_id",
          select: "_id name symbol img decimals address owner volume",
          model: "token",
        })
        .populate({
          path: "to_token_id",
          select: "_id name symbol img decimals address owner volume",
          model: "token",
        })
        .exec();
      const usdTransactions = await UsdTransaction.find({ wallet: address });
      const liquidityTransactions = await LiquidityTransaction.find({
        wallet: address,
      })
        .populate({
          path: "pool_id",
          select: "_id name address address_lpt total_liquidity volume",
          model: "pool",
        })
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
      const nftTransactions = await NftTransaction.find({
        from_wallet: address,
      })
        .populate({
          path: "collection_id",
          select: "_id name address owner total_supply description volume",
          model: "collection",
        })
        .exec();

      const results = [
        ...tokenTransactions,
        ...usdTransactions,
        ...liquidityTransactions,
        ...nftTransactions,
      ];
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async getPoolTransactionByAddress(req, res) {
    try {
      const { address } = req.params;
      if (!ethers.isAddress(address)) {
        return res.status(400).json({
          message: "Invalid address.",
        });
      }
      const pool = await Pool.findOne({ address: address }).lean();

      console.log(pool._id.toString());
      const liquidityTransactions = await LiquidityTransaction.find({
        pool_id: pool._id.toString(),
      })
        .populate({
          path: "pool_id",
          select: "_id name address address_lpt total_liquidity volume",
          model: "pool",
          populate: [
            {
              path: "token1_id",
              select: "_id name symbol img decimals address owner volume",
              model: "token",
            },
            {
              path: "token2_id",
              select: "_id name symbol img decimals address owner volume",
              model: "token",
            },
          ],
        })
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

      const results = [...liquidityTransactions];

      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }
}

module.exports = new TransactionController();
