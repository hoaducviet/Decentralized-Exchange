const { getAccessToken } = require("../utils/getAccessToken.js");
const { createPayout } = require("../utils/createPayout.js");
const { showPayout } = require("../utils/showPayout.js");
const { showPayment } = require("../utils/showPayment.js");
const { getOrderId } = require("../utils/getOrderId.js");
const { withdrawUSD, depositUSD } = require("./WalletController.js");
const { ethers, formatEther } = require("ethers");
const UsdTransaction = require("../models/UsdTransaction.js");
const { mongooseToObject } = require("../utils/mongoose.js");
const { wallet } = require("./WalletController.js");

const payee_email = process.env.PAYEE_EMAIL;
class PaymentController {
  async payout(req, res) {
    let transactionId;
    try {
      console.log("Withdraw");
      const { address, value, email } = req.body;
      if (!ethers.isAddress(address) || parseFloat(value) <= 0) {
        return res.status(500).json({ message: "Internal server error" });
      }
      const transaction = await new UsdTransaction({
        type: "Payout",
        method: "Paypal",
        wallet: address,
        amount: value,
        payer_email: email,
        payee_email: payee_email,
        status: "Pending",
      }).save();

      transactionId = transaction._id;
      const valueBeforeFee = (parseFloat(value) * 0.997).toString();
      const token = await getAccessToken();
      const payout = await createPayout(token, valueBeforeFee, email);
      console.log("ID payout: ", payout.batch_header.payout_batch_id);
      const receipt = await withdrawUSD(address, value);
      const confirmedReceipt = await wallet.provider.waitForTransaction(
        receipt.hash
      );
      if (confirmedReceipt?.status !== 1) {
        return res.status(500).json({ message: "Withdraw failer" });
      }
      const response = await UsdTransaction.findByIdAndUpdate(
        transaction._id,
        {
          order_id: payout.batch_header.payout_batch_id,
          platform_fee: (parseFloat(value) * 0.03).toString(),
          gas_fee: formatEther(
            confirmedReceipt.gasPrice * confirmedReceipt.gasUsed
          ),
          receipt_hash: confirmedReceipt.hash,
          status: "Completed",
          notes: payout.batch_header.sender_batch_header.sender_batch_id,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json(mongooseToObject(response));
    } catch (error) {
      console.error("Error avatar:", error.message);
      await UsdTransaction.findByIdAndUpdate(transactionId, {
        status: "Failed",
      });
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  async showPayout(req, res) {
    try {
      const payoutId = req.params.id;
      const token = await getAccessToken();
      const detail = await showPayout(token, payoutId);
      return res.json(detail);
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async showPayment(req, res) {
    try {
      const orderId = req.params.id;
      const token = await getAccessToken();
      const detail = await showPayment(token, orderId);
      return res.json(detail);
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async payment(req, res) {
    try {
      console.log("Deposit");
      const transaction = req.body;
      if (!transaction) {
        return res.status(404).json({ message: "Erorr" });
      }

      const receipt = await depositUSD(
        transaction.wallet,
        transaction.amount,
        transaction.percent_eth
      );
      const confirmedReceipt = await wallet.provider.waitForTransaction(
        receipt.hash
      );

      if (confirmedReceipt?.status !== 1) {
        await new UsdTransaction({
          type: "Payment",
          method: "Paypal",
          ...transaction,
          status: "Failed",
        }).save();
        return;
      }

      const result = await new UsdTransaction({
        type: "Payment",
        method: "Paypal",
        ...transaction,
        platform_fee:
          parseFloat(transaction.amount) *
          (0.03 + 0.02 * parseFloat(transaction.percent_eth)),
        gas_fee: formatEther(
          confirmedReceipt.gasPrice * confirmedReceipt.gasUsed
        ),
        receipt_hash: receipt.hash,
        status: "Completed",
      }).save();

      return res.status(200).json({
        mesage: "Success fully created",
        data: mongooseToObject(result),
      });
    } catch (error) {
      console.error("Error avatar:", error.message);
    }
  }

  async orderId(req, res) {
    try {
      const { address, value } = req.body;
      const token = await getAccessToken();
      const result = await getOrderId(token, address, value);
      console.log(result.id);
      res.status(200).json({ id: result.id, url: result.links[1].href });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new PaymentController();
