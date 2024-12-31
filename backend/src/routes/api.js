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
const OrderController = require("../controllers/OrderController");
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const PendingCollectionController = require("../controllers/PendingCollectionController");
const PendingNFT = require("../models/PendingNFT");
const PendingNFTController = require("../controllers/PendingNFTController");
//Site
router.get("/search", SiteController.search);

//Wallet
router.get("/collection", WalletController.getCollection);
router.get(
  "/tokenbalances",
  AuthController.authenticateJWT,
  WalletController.getTokenBalances
);
router.get(
  "/liquiditybalances",
  AuthController.authenticateJWT,
  WalletController.getLiquidityBalances
);
router.get(
  "/nftbalances",
  AuthController.authenticateJWT,
  WalletController.getNFTBalances
);

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
router.get(
  "/collections/:address",
  CollectionController.getCollectionByAddress
);

//Order
router.post(
  "/addorder",
  AuthController.authenticateJWT,
  OrderController.addOrder
);
router.patch(
  "/updateorder",
  AuthController.authenticateJWT,
  OrderController.updateOrder
);
router.post(
  "/cancelorder",
  AuthController.authenticateJWT,
  OrderController.cancelOrder
);

//Transaction
router.post(
  "/addtransaction/token",
  AuthController.authenticateJWT,
  TransactionController.addTokenTransaction
);
router.patch(
  "/updatetransaction/token",
  AuthController.authenticateJWT,
  TransactionController.updateTokenTransaction
);

router.post(
  "/addtransaction/liquidity",
  AuthController.authenticateJWT,
  TransactionController.addLiquidityTransaction
);
router.patch(
  "/updatetransaction/liquidity",
  AuthController.authenticateJWT,
  TransactionController.updateLiquidityTransaction
);

router.post(
  "/addtransaction/nft",
  AuthController.authenticateJWT,
  TransactionController.addNftTransaction
);
router.patch(
  "/updatetransaction/nft",
  AuthController.authenticateJWT,
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
  AuthController.authenticateJWT,
  TransactionController.getActiveTransactionsByAddress
);

//JWT
router.post("/login", AuthController.generateTokenJWT);
router.get("/jwt/auth", AuthController.authenticateJWT);

//Pending Collection
router.post(
  "/register/pendingcollection",
  PendingCollectionController.registerPendingCollection
);
router.post(
  "/agree/pendingcollection",
  PendingCollectionController.agreeCollection
);
router.get(
  "/pendingcollections/:address",
  PendingCollectionController.getPendingCollectionByAddress
);

//Pending NFT
router.get("/pendingnfts/:id", PendingNFTController.getPendingNFTsByCollection);
router.get("/pendingnft", PendingNFTController.getPendingNFTItem);

//User
router.get("/insertuser", UserController.insertUser);

module.exports = router;
