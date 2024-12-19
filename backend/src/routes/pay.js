const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");

router.post("/paypal/payout", PaymentController.payout);
router.get("/paypal/payout/:id", PaymentController.showPayout);
router.get("/paypal/:id", PaymentController.showPayment);
router.post("/paypal/payment", PaymentController.payment);
router.post("/paypal/webhook", PaymentController.webhook);
router.post("/paypal/orderid", PaymentController.orderId);

module.exports = router;
