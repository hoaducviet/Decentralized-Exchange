const express = require("express");
const router = express.Router();

const SiteController = require("../controllers/SiteController");
const WalletController = require("../controllers/WalletController");
const TokenController = require("../controllers/TokenController");
const PoolController = require("../controllers/PoolController");
const CollectionController = require("../controllers/CollectionController");
const TransactionController = require("../controllers/TransactionController");

//Site
router.get("/search", SiteController.search);

//Wallet
router.get("/collection", WalletController.getCollection);
router.get("/tokenbalances", WalletController.getTokenBalances);
router.get("/liquiditybalances", WalletController.getLiquidityBalances);
router.get("/nftbalances", WalletController.getNFTBalances);
router.get("/reservepools", WalletController.getReservePools);

//Token
router.get("/updatetokens", TokenController.updateToken);
router.get("/tokens", TokenController.getTokenAll);

//Pool
router.get("/updatepools", PoolController.updatePool);
router.get("/pools", PoolController.getPoolAll);

//Collections
router.get("/updatecollections", CollectionController.updateCollection);
router.get("/collections", CollectionController.getCollectionAll);

//Transaction
router.post("/addtransaction/token", TransactionController.addTokenTransaction);
router.patch(
  "/updatetransaction/token/:id",
  TransactionController.updateTokenTransaction
);

router.post(
  "/addtransaction/liquidity",
  TransactionController.addLiquidityTransaction
);
router.patch(
  "/updatetransaction/liquidity/:id",
  TransactionController.updateLiquidityTransaction
);

router.post("/addtransaction/nft", TransactionController.addNftTransaction);
router.patch(
  "/updatetransaction/nft/:id",
  TransactionController.updateNftTransaction
);

router.get("/tokentransactions", TransactionController.getTokenTransactionAll);
router.get(
  "/transactionallbyaddress",
  TransactionController.getActiveTransactionByAddress
);

//Active
router.get(
  "/actives/:address",
  TransactionController.getActiveTransactionByAddress
);
router.get(
  "/transactions/tokens",
  TransactionController.getTokenTransactionAll
);

module.exports = router;
