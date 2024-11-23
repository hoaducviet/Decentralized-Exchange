const ethers = require("ethers");
const { provider } = require("../config/provider");
const {
  getPriceTokenTransaction,
} = require("../utils/getPriceTokenTransaction.js");

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

console.log(tokenEventTopics);

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
            updateData = {
              amount_token1: ethers.formatUnits(
                amount1,
                transaction.token1_id.decimals
              ),
              amount_token2: ethers.formatUnits(
                amount2,
                transaction.token2_id.decimals
              ),
              amount_lpt: ethers.formatEther(liquidityTokens),
              ...updateData,
            };
          }
        });
      }

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
      console.log(receipt);
      const updateData = {
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

  async getTokenTransactionAll(req, res) {
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

  async getNftTransactionByItem(req, res) {
    try {
      const { collection, nft } = req.query;
      console.log({ collection, nft });
      const results = await NftTransaction.find({
        collection_id: collection,
        nft_id: nft,
        status: "Completed",
      }).lean();
      const listed = [];
      const prices = [];
      await Promise.all(
        results.map((item) => {
          if (item.type === "Listed NFT") {
            listed.push(item);
          }
          if (item.type === "Buy NFT") {
            prices.push(item);
          }
        })
      );
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      listed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      prices.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return res.status(200).json({ listed, prices, actives: results });
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get nft transaction" });
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
