const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");

router.post("/paypal", PaymentController.paypal);

module.exports = router;
