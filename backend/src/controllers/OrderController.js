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
const WalletController = require("./WalletController");
const Order = require("../models/Order");

const OrderLimit = require("../artifacts/OrderLimit.json");

const signer = WalletController.wallet;
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const UsdTransaction = require("../models/UsdTransaction.js");
const LPToken = require("../artifacts/LPToken.json");
const Pool = require("../models/Pool.js");
const Reserve = require("../models/Reserve.js");
const Token = require("../models/Token.js");

const addressOrderContract = process.env.ADDRESS_ORDER_LIMIT;

const orderEventAbi = [
  "event OrderCreated( uint256 orderId, address indexed from, address indexed to, address indexed pool, address token, uint256 amount, uint256 reserve )",
  "event ExchangedOrder( uint256 orderId, address indexed from, address indexed to, address indexed pool, address token, uint256 amount, uint256 amountOut )",
  "event CancelOrder( uint orderId, address indexed from, address indexed to, address token, uint256 amount )",
];

const orderEventTopics = orderEventAbi.map(
  (abi) => ethers.EventFragment.from(abi).topicHash
);

const orderContract = new ethers.Contract(
  addressOrderContract,
  OrderLimit.abi,
  signer
);

class OrderController {
  async addOrder(req, res) {
    try {
      const newOrder = req.body;
      console.log(newOrder)
      if (
        !newOrder.from_wallet ||
        !newOrder.to_wallet ||
        !newOrder.pool_id ||
        !newOrder.from_token_id ||
        !newOrder.to_token_id ||
        !newOrder.amount_in ||
        !newOrder.price
      ) {
        return res.status(400).json({
          message: "Missing fields.",
        });
      }

      const result = await new Order(newOrder).save();

      return res.status(200).json(mongooseToObject(result));
    } catch (error) {
      console.error("Error transaction:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all transaction" });
    }
  }

  async updateOrder(req, res) {
    try {
      const { _id, receipt_hash, date } = req.body;
      const order = await Order.findById(_id)
        .populate({
          path: "from_token_id",
          model: "token",
        })
        .populate({
          path: "to_token_id",
          model: "token",
        });

      const dateTime = new Date();
      const additionalDays = Number(date) || 0;
      dateTime.setDate(dateTime.getDate() + additionalDays);

      if (!receipt_hash) {
        const result = await Order.findByIdAndUpdate(
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
        receipt_hash,
        expiredAt: dateTime,
      };

      if (receipt.logs && receipt.logs.length > 0) {
        receipt.logs.forEach((log) => {
          if (log.topics[0] === orderEventTopics[0]) {
            const [orderId, token, amount, reserve] =
              ethers.AbiCoder.defaultAbiCoder().decode(
                ["uint256", "address", "uint256", "uint256"],
                log.data
              );
            console.log(
              `Order by ${log.topics[1]}, amount1: ${orderId}, amount2: ${token}`
            );
            updateData = {
              order_id: Number(orderId),
              ...updateData,
            };
          }
        });
      }

      const result = await Order.findByIdAndUpdate(order._id, updateData, {
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

  async cancelOrderAuto() {
    try {
      const now = new Date();
      const orders = await Order.find({
        status: "Pending",
        expiredAt: { $lt: now },
      });

      const ordersCancel = await Promise.all(
        orders.map(async (item, index) => {
          // Lấy nonce cho mỗi giao dịch (đảm bảo rằng không trùng lặp)
          const nonce =
            (await provider.getTransactionCount(signer.address, "latest")) +
            index;

          try {
            const receipt = await orderContract.cancelOrder(item.order_id, {
              nonce: nonce,
            });
            await receipt.wait();

            return receipt.hash ? { _id: item._id } : null;
          } catch (error) {
            console.error(`Error with order ${item.order_id}:`, error.message);
            return null;
          }
        })
      );

      const validOrders = ordersCancel.filter((item) => item !== null);
      await Promise.all(
        validOrders.map(async (item) => {
          await Order.findByIdAndUpdate(item._id, {
            status: "Failed",
          });
        })
      );

      return;
    } catch (error) {
      console.error("Error transaction:", error.message);
    }
  }

  async cancelOrder(req, res) {
    const { order_id } = req.body;
    try {
      console.log(order_id);
      const order = await Order.findOne({ order_id, status: "Pending" });
      if (!order) {
        return res.status(404).json({ message: "Not found" });
      }

      const receipt = await orderContract.cancelOrder(order.order_id);
      await receipt.wait();
      if (!receipt.hash) {
        return res.status(404).json({ message: "Not found" });
      }

      const result = await Order.findByIdAndUpdate(
        order._id,
        {
          status: "Failed",
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
    }
  }

  async exchangeOrder(pool_id) {
    try {
      const now = new Date();
      const orders = await Order.find({
        pool_id,
        status: "Pending",
        expiredAt: { $gte: now },
      }).sort({ createdAt: 1 });

      const reserve = await Reserve.findOne({ pool_id })
        .sort({ createAt: -1 })
        .limit(1);
      const pool = await Pool.findById(pool_id);

      let orderAccept;
      for (const item of orders) {
        if (item.from_token_id.toString() === pool.token1_id.toString()) {
          if (
            parseFloat(item.price) <=
            parseFloat(reserve.reserve_token2) /
              parseFloat(reserve.reserve_token1)
          ) {
            orderAccept = item;
            break;
          }
        }
        if (item.from_token_id.toString() === pool.token2_id.toString()) {
          if (
            parseFloat(item.price) <=
            parseFloat(reserve.reserve_token1) /
              parseFloat(reserve.reserve_token2)
          ) {
            orderAccept = item;
            break;
          }
        }
      }

      if (orderAccept) {
        const nonce = await provider.getTransactionCount(
          signer.address,
          "latest"
        );
        const tx = await orderContract.exchangedOrder(orderAccept.order_id, {
          nonce: nonce,
        });
        await tx.wait();

        if (!tx.hash) {
          await Order.findByIdAndUpdate(orderAccept._id, {
            status: "Failed",
          });
          return;
        }

        const tokenOut = await Token.findById(
          pool.token1_id === orderAccept.from_token_id
            ? pool.token1_id
            : pool.token2_id
        );

        let updateData = {
          receipt_hash: tx.hash,
          status: "Completed",
        };

        const receipt = await provider.getTransactionReceipt(tx.hash);
        if (receipt.logs && receipt.logs.length > 0) {
          receipt.logs.forEach((log) => {
            if (log.topics[0] === orderEventTopics[1]) {
              const [orderId, token, amount, amountOut] =
                ethers.AbiCoder.defaultAbiCoder().decode(
                  ["uint256", "address", "uint256", "uint256"],
                  log.data
                );
              console.log(
                `Order by ${log.topics[1]}, amount1: ${orderId}, amount2: ${token}`
              );
              updateData = {
                amount_out: ethers.formatUnits(amountOut, tokenOut.decimals),
                ...updateData,
              };
            }
          });
        }

        const result = await Order.findByIdAndUpdate(
          orderAccept._id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

        console.log(result);
      }
      return;
    } catch (error) {
      console.error("Error transaction:", error.message);
    }
  }
}

module.exports = new OrderController();
