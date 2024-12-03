const express = require("express");
const router = express.Router();

const SiteController = require("../controllers/SiteController");
const WalletController = require("../controllers/WalletController");
const TokenController = require("../controllers/TokenController");
const PoolController = require("../controllers/PoolController");
const NFTController = require("../controllers/NFTController");
const CollectionController = require("../controllers/CollectionController");
const TransactionController = require("../controllers/TransactionController");
const ReserveController = require("../controllers/ReserveController");
const TokenPriceController = require("../controllers/TokenPriceController");
const UserController = require("../controllers/UserController");
//Site
router.get("/search", SiteController.search);

//Wallet
router.get("/collection", WalletController.getCollection);
router.get("/tokenbalances", WalletController.getTokenBalances);
router.get("/liquiditybalances", WalletController.getLiquidityBalances);
router.get("/nftbalances", WalletController.getNFTBalances);

//Token
router.get("/updatetokens", TokenController.updateToken);
router.get("/tokens", TokenController.getTokenAll);

//Pool
router.get("/updatepools", PoolController.updatePool);
router.get("/pools", PoolController.getPoolAll);

//NFT
router.get("/updatenfts", NFTController.updateNFT);
router.get("/nfts/:id", NFTController.getNFTsByCollection);
router.get("/nft", NFTController.getNFTItem);

//Reserve
router.get("/updatereserves", ReserveController.updateReserve);
router.get("/reserves", ReserveController.getReserveAll);
router.get("/reserves/:id", ReserveController.getReserveByPool);

//Token Price
router.get("/tokenprices", TokenPriceController.getTokenPriceAll);
router.get("/tokenprices/:id", TokenPriceController.getTokenPrice);

//Collections
router.get("/updatecollections", CollectionController.updateCollection);
router.get("/collections", CollectionController.getCollectionAll);
router.get("/collections/top", CollectionController.getCollectionTop);

//Transaction
router.post("/addtransaction/token", TransactionController.addTokenTransaction);
router.patch(
  "/updatetransaction/token",
  TransactionController.updateTokenTransaction
);

router.post(
  "/addtransaction/liquidity",
  TransactionController.addLiquidityTransaction
);
router.patch(
  "/updatetransaction/liquidity",
  TransactionController.updateLiquidityTransaction
);

router.post("/addtransaction/nft", TransactionController.addNftTransaction);
router.patch(
  "/updatetransaction/nft",
  TransactionController.updateNftTransaction
);

router.get(
  "/transactions/tokens",
  TransactionController.getTokenTransactionsAll
);
router.get(
  "/transactions/tokens/:id",
  TransactionController.getTokenTransactions
);

router.get(
  "/transactions/pools/:id",
  TransactionController.getPoolTransactions
);

router.get(
  "/transactions/nfts/nft",
  TransactionController.getNftTransactionsByItem
);

router.get("/transactions/dailyvolume", TransactionController.getDailyVolume);
router.get("/transactions/dailytvl", TransactionController.getDailyTVL);

//Active
router.get(
  "/actives/:address",
  TransactionController.getActiveTransactionsByAddress
);

//User
router.get("/insertuser", UserController.insertUser);

module.exports = router;
