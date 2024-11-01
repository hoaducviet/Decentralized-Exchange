const { getAccessToken } = require("../utils/getAccessToken.js");
const { createPayout } = require("../utils/createPayout.js");
const { showPayout } = require("../utils/showPayout.js");
const { showPayment } = require("../utils/showPayment.js");
const { getOrderId } = require("../utils/getOrderId.js");
const { withdrawUSD, depositUSD } = require("./WalletController.js");
const { ethers } = require("ethers");

class PaymentController {
  async payout(req, res) {
    try {
      console.log("Withdraw");
      const { address, value, email } = req.body;
      if (!ethers.isAddress(address) || parseFloat(value) <= 0) {
        return res.status(500).json({ message: "Internal server error" });
      }
      console.log("Address withdraw:", address);
      const receipt = await withdrawUSD(address, value);
      if (!receipt) {
        return res.status(500).json({ message: "Withdraw failer" });
      }
      console.log("Receipt withdraw:", receipt.hash);
      const token = await getAccessToken();
      const payout = await createPayout(token, value, email);
      console.log("ID payout: ", payout.batch_header.payout_batch_id);
      return res.status(200).json(payout);
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
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
    const eventBody = req.body;
    if (
      eventBody.event_type === "PAYMENT.CAPTURE.COMPLETED" &&
      eventBody.resource.status === "COMPLETED" &&
      ethers.isAddress(eventBody.resource.custom_id) &&
      parseFloat(eventBody.resource.amount.value) > 0 &&
      eventBody.resource.amount.currency_code === "USD"
    ) {
      console.log("Deposit");
      const receipt = await depositUSD(
        eventBody.resource.custom_id,
        eventBody.resource.amount.value
      );
      console.log(receipt.hash);
      console.log("Address deposit: ", eventBody.resource.custom_id);
    }
    res.status(200).send("Received");
  }

  async orderId(req, res) {
    const { address, value } = req.body;
    const token = await getAccessToken();
    const result = await getOrderId(token, address, value);
    console.log(result);
    res.status(200).json({ id: result.id, url: result.links[1].href });
  }
}

module.exports = new PaymentController();
