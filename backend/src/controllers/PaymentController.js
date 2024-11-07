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
        status: "Pending",
      }).save();

      transactionId = transaction._id;
      const token = await getAccessToken();
      const payout = await createPayout(token, value, email);
      console.log("ID payout: ", payout.batch_header.payout_batch_id);
      const receipt = await withdrawUSD(address, value);
      const confirmedReceipt = await wallet.provider.waitForTransaction(
        receipt.hash
      );
      if (confirmedReceipt?.status !== 1) {
        return res.status(500).json({ message: "Withdraw failer" });
      }
      console.log("Receipt withdraw:", receipt.hash);
      const response = await UsdTransaction.findByIdAndUpdate(
        transaction._id,
        {
          order_id: payout.batch_header.payout_batch_id,
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

      const result = await new UsdTransaction({
        type: "Payment",
        method: "Paypal",
        wallet: transaction.wallet,
        amount: transaction.amount,
        currency: transaction.currency,
        order_id: transaction.order_id,
        invoice_id: transaction.invoice_id,
        payer_email: transaction.payer_email,
        payee_email: transaction.payee_email,
        status: "Pending",
      }).save();

      return res.status(200).json({
        mesage: "Success fully created",
        data: mongooseToObject(result),
      });
    } catch (error) {
      console.error("Error avatar:", error.message);
    }
  }

  async webhook(req, res) {
    const eventBody = req.body;
    res.status(200).send("Received");
    if (
      eventBody.event_type === "PAYMENT.CAPTURE.COMPLETED" &&
      eventBody.resource.status === "COMPLETED" &&
      ethers.isAddress(eventBody.resource.custom_id) &&
      parseFloat(eventBody.resource.amount.value) > 0 &&
      eventBody.resource.amount.currency_code === "USD"
    ) {
      try {
        console.log("Update deposit");
        const receipt = await depositUSD(
          eventBody.resource.custom_id,
          eventBody.resource.amount.value
        );
        console.log("Hash: ", receipt.hash);
        console.log("Address: ", eventBody.resource.custom_id);

        const confirmedReceipt = await wallet.provider.waitForTransaction(
          receipt.hash
        );

        if (confirmedReceipt?.status !== 1) {
          return;
        }
        const response = await UsdTransaction.findOneAndUpdate(
          { invoice_id: eventBody.resource.invoice_id },
          {
            gas_fee: formatEther(
              confirmedReceipt.gasPrice * confirmedReceipt.gasUsed
            ),
            receipt_hash: confirmedReceipt.hash,
            status: "Completed",
            notes: eventBody.summary,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        console.log("Status: ", response.status);
      } catch (error) {
        console.log(error);
        await UsdTransaction.updateOne(
          { invoice_id: eventBody.resource.invoice_id },
          {
            status: "Failed",
            notes: eventBody.summary,
          }
        );
      }
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
