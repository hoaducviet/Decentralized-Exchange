const ethers = require("ethers");
const { provider } = require("../config/provider");
const {
  getPriceTokenTransaction,
} = require("../utils/getPriceTokenTransaction.js");
const {
  getPriceLiquidityTransaction,
} = require("../utils/getPriceLiquidityTransaction.js");

const {
  getPriceNftTransaction,
} = require("../utils/getPriceNftTransaction.js");
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
const Reserve = require("../models/Reserve.js");

const liquidityEventAbi = [
  "event LiquidityAdded( address indexed provider, uint256 amount1, uint256 amount2, uint256 liquidityTokens)",
  "event LiquidityRemoved( address indexed provider, uint256 amount1, uint256 amount2, uint256 liquidityTokens)",
];

const liquidityEventTopics = liquidityEventAbi.map(
  (abi) => ethers.EventFragment.from(abi).topicHash
);
const tokenEventAbi = [
  "event TokensSwapped( address indexed provider, address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut)",
];
const tokenEventTopics = tokenEventAbi.map(
  (abi) => ethers.EventFragment.from(abi).topicHash
);

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
      const { _id, receipt_hash } = req.body;
      const transaction = await TokenTransaction.findById(_id)
        .populate({
          path: "from_token_id",
          model: "token",
        })
        .populate({
          path: "to_token_id",
          model: "token",
        });

      if (!receipt_hash) {
        const result = await TokenTransaction.findByIdAndUpdate(
          _id,
          { status: "Failed" },
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(404).json(mongooseToObject(result));
      }
      const receipt = await provider.getTransactionReceipt(receipt_hash);

      let updateData = {
        price: await getPriceTokenTransaction(
          transaction.from_token_id,
          transaction.amount_in
        ),
        gas_fee: ethers.formatEther(receipt.gasPrice * receipt.gasUsed),
        receipt_hash,
        status: "Completed",
      };
      console.log(updateData);

      if (receipt.logs && receipt.logs.length > 0) {
        receipt.logs.forEach((log) => {
          if (log.topics[0] === tokenEventTopics[0]) {
            const [amountIn, amountOut] =
              ethers.AbiCoder.defaultAbiCoder().decode(
                ["uint256", "uint256"],
                log.data
              );
            console.log(
              `Swap token by ${log.topics[1]}, amount1: ${amountIn}, amount2: ${amountOut}`
            );
            updateData = {
              amount_out: ethers.formatUnits(
                amountOut,
                transaction.to_token_id.decimals
              ),
              ...updateData,
            };
          }
        });
      }

      const result = await TokenTransaction.findByIdAndUpdate(
        transaction._id,
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
      const { _id, receipt_hash } = req.body;
      const transaction = await LiquidityTransaction.findById(_id)
        .populate({
          path: "token1_id",
          model: "token",
        })
        .populate({
          path: "token2_id",
          model: "token",
        });

      if (!receipt_hash) {
        const result = await LiquidityTransaction.findByIdAndUpdate(
          _id,
          { status: "Failed" },
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(404).json(mongooseToObject(result));
      }

      const receipt = await provider.getTransactionReceipt(receipt_hash);

      let updateData = {
        gas_fee: ethers.formatEther(receipt.gasPrice * receipt.gasUsed),
        receipt_hash,
        status: "Completed",
      };
      let amount_token1, amount_token2, amount_lpt;

      if (receipt.logs && receipt.logs.length > 0) {
        receipt.logs.forEach((log) => {
          if (liquidityEventTopics.includes(log.topics[0])) {
            const [amount1, amount2, liquidityTokens] =
              ethers.AbiCoder.defaultAbiCoder().decode(
                ["uint256", "uint256", "uint256"],
                log.data
              );
            console.log(
              `Liquidity amount1: ${amount1}, amount2: ${amount2}, lpt: ${liquidityTokens}`
            );
            if ((amount1, amount2, liquidityTokens)) {
              amount_token1 = ethers.formatUnits(
                amount1,
                transaction.token1_id.decimals
              );
              amount_token2 = ethers.formatUnits(
                amount2,
                transaction.token2_id.decimals
              );
              amount_lpt = ethers.formatEther(liquidityTokens);
            }
          }
        });
      }

      updateData = {
        price: await getPriceLiquidityTransaction(
          transaction.token1_id,
          transaction.token2_id,
          amount_token1,
          amount_token2
        ),
        amount_token1,
        amount_token2,
        amount_lpt,
        ...updateData,
      };

      const result = await LiquidityTransaction.findByIdAndUpdate(
        transaction._id,
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
      const { _id, receipt_hash } = req.body;
      const transaction = await NftTransaction.findById(_id);
      console.log(transaction.price);
      if (!receipt_hash) {
        const result = await NftTransaction.findByIdAndUpdate(
          _id,
          { status: "Failed" },
          {
            new: true,
            runValidators: true,
          }
        );
        return res.status(404).json(mongooseToObject(result));
      }
      const receipt = await provider.getTransactionReceipt(receipt_hash);
      const updateData = {
        priceUsd: await getPriceNftTransaction(transaction.price),
        gas_fee: ethers.formatEther(receipt.gasPrice * receipt.gasUsed),
        receipt_hash,
        status: "Completed",
      };

      const result = await NftTransaction.findByIdAndUpdate(_id, updateData, {
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

  async getTokenTransactionsAll(req, res) {
    try {
      const tokenTransactions = await TokenTransaction.find({
        status: "Completed",
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

  async getTokenTransactions(req, res) {
    try {
      const { id } = req.params;
      const tokenTransactions = await TokenTransaction.find({
        $or: [{ from_token_id: id }, { to_token_id: id }],
        status: "Completed",
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

  async getNftTransactionsByItem(req, res) {
    try {
      const { collection, nft } = req.query;
      const results = await NftTransaction.find({
        collection_id: collection,
        nft_id: nft,
        status: "Completed",
      }).lean();
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get nft transaction" });
    }
  }

  async getActiveTransactionsByAddress(req, res) {
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

  async getPoolTransactions(req, res) {
    try {
      const { id } = req.params;

      const liquidityTransactions = await LiquidityTransaction.find({
        pool_id: id,
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

      const tokenTransactions = await TokenTransaction.find({
        pool_id: id,
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

      const results = [...tokenTransactions, ...liquidityTransactions];

      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async getDailyVolume(req, res) {
    try {
      const results = await TokenTransaction.aggregate([
        {
          $match: {
            type: { $in: ["Swap Token", "Buy Token", "Sell Token"] },
            status: "Completed",
          },
        },
        {
          // Chuyển đổi thời gian 'createdAt' thành ngày (yyyy-MM-dd)
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
            transaction_count: { $sum: 1 }, // Đếm số giao dịch trong ngày
          },
        },
        {
          $project: {
            date: "$_id.day",
            price: "$total_price",
            transaction_count: 1,
            _id: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);

      if (!results.length) {
        return res.status(404).json({ message: "Volume's nft is null" });
      }
      return res.status(200).json(results);
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }
}

module.exports = new TransactionController();
