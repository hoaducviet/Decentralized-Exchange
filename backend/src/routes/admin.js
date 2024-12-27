const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const SiteController = require("../controllers/SiteController");
const AccountController = require("../controllers/AccountController");
const TokenController = require("../controllers/TokenController");
const PoolController = require("../controllers/PoolController");
const CollectionController = require("../controllers/CollectionController");
const ReserveController = require("../controllers/ReserveController");
const NFTController = require("../controllers/NFTController");

//Account
router.get(
  "/accounts",
  AuthController.authenticateJWTAdmin,
  AccountController.getAllAccount
);
router.post(
  "/insert/account",
  AuthController.authenticateJWTAdmin,
  AccountController.insertAccount
);
router.patch(
  "/update/account",
  AuthController.authenticateJWTAdmin,
  AccountController.updateInfoAccount
);
router.patch(
  "/delete/account",
  AuthController.authenticateJWTAdmin,
  AccountController.deleteAccount
);

//Token
router.get("/tokens/suspended", TokenController.getTokenSuspended);
router.post("/update/tokens", TokenController.updateToken);
router.post("/create/token", TokenController.createToken);
router.post("/add/token", TokenController.addToken);
router.patch("/delete/token", TokenController.deleteToken);
router.patch("/active/token", TokenController.activeToken);

//Pool
router.get("/pools/suspended", PoolController.getPoolSuspended);
router.post("/update/pools", PoolController.updatePool);
router.post("/create/pool", PoolController.createPool);
router.patch("/delete/pool", PoolController.deletePool);
router.patch("/active/pool", PoolController.activePool);

//Collection
router.get(
  "/collections/suspended",
  CollectionController.getCollectionSuspended
);
router.post("/update/collections", CollectionController.updateCollection);
router.patch("/delete/collection", CollectionController.deleteCollection);
router.patch("/active/collection", CollectionController.activeCollection);

router.post("/create/pool", PoolController.createPool);

//Reserve
router.post("/update/reserves", ReserveController.updateReserve);

//NFT
router.post("/update/nfts", NFTController.updateNFT);

router.get("/search", SiteController.search);

module.exports = router;
