const express = require("express");
const router = express.Router();

const SiteController = require("../controllers/SiteController");
const WalletController = require("../controllers/WalletController");

//Site
router.get("/search", SiteController.search);
router.get("/tokens", WalletController.getTokens);
router.get("/pools", WalletController.getPools);
router.get("/collections", WalletController.getCollections);
router.get("/collection", WalletController.getCollection);
router.get("/tokenbalances", WalletController.getTokenBalances);
router.get("/liquiditybalances", WalletController.getLiquidityBalances);
router.get("/reservepools", WalletController.getReservePools);

module.exports = router;
