const Collection = require("../models/Collection");
const Pool = require("../models/Pool");
const Token = require("../models/Token");
const Reserve = require("../models/Reserve");

const SiteController = require("../controllers/SiteController");
const WalletController = require("../controllers/WalletController");
const TokenController = require("../controllers/TokenController");
const PoolController = require("../controllers/PoolController");
const CollectionController = require("../controllers/CollectionController");
const TransactionController = require("../controllers/TransactionController");
const TokenPriceController = require("../controllers/TokenPriceController");
const TokenTransaction = require("../models/TokenTransaction");
const LiquidityTransaction = require("../models/LiquidityTransaction");
const UsdTransaction = require("../models/UsdTransaction");
const NftTransaction = require("../models/NftTransaction");
const TokenPrice = require("../models/TokenPrice");
const NFT = require("../models/NFT");
const Order = require("../models/Order");
const OrderController = require("../controllers/OrderController");

function socket(io) {
  const generalNamespace = io.of("/general");
  const personalNamespace = io.of("/personal");

  Token.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          price: change.fullDocument.price,
          price_reference: change.fullDocument.price_reference,
          total_supply: change.fullDocument.total_supply,
          volume: change.fullDocument.volume,
        };
        generalNamespace.emit("updateToken", { data: updateDocument });
      }
    }
  );

  Reserve.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update", "insert"].includes(change.operationType)) {
        const updateDocument = {
          pool_id: change.fullDocument.pool_id,
          reserve1: change.fullDocument.reserve_token1,
          reserve2: change.fullDocument.reserve_token2,
        };
        console.log(updateDocument);
        generalNamespace.emit("updateReserves", { data: updateDocument });
        await TokenPriceController.addTokenPrice(updateDocument);
        setTimeout(async () => {
          await OrderController.exchangeOrder(updateDocument.pool_id);
        }, 5000);
      }
    }
  );

  TokenPrice.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update", "insert"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          token_id: change.fullDocument.token_id,
          price: change.fullDocument.price,
          createdAt: change.fullDocument.createdAt,
        };
        console.log(updateDocument);
        generalNamespace.emit("updateTokenPrices", { data: updateDocument });
        await TokenController.updatePrice(updateDocument);
      }
    }
  );

  Collection.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    (change) => {
      if (["update"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          floor_price: change.fullDocument.floor_price,
          highest_price: change.fullDocument.highest_price,
          total_items: change.fullDocument.total_items,
          total_listed: change.fullDocument.total_listed,
          total_owners: change.fullDocument.total_owners,
          volume: change.fullDocument.volume,
        };
        console.log(updateDocument);
        generalNamespace.emit("updateCollection", { data: updateDocument });
      }
    }
  );

  NFT.watch([], { fullDocument: "updateLookup" }).on("change", (change) => {
    if (["update"].includes(change.operationType)) {
      const updateDocument = {
        _id: change.fullDocument._id,
        owner: change.fullDocument.owner,
        price: change.fullDocument.price,
        formatted: change.fullDocument.formatted,
        isListed: change.fullDocument.isListed,
      };
      console.log(updateDocument);
      generalNamespace.emit("updateNft", { data: updateDocument });
    }
  });

  TokenTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update", "insert"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          type: change.fullDocument.type,
          from_wallet: change.fullDocument.from_wallet,
          to_wallet: change.fullDocument.to_wallet,
          pool_id: change.fullDocument.pool_id,
          from_token_id: await Token.findById(
            change.fullDocument.from_token_id
          ),
          to_token_id: await Token.findById(change.fullDocument.to_token_id),
          amount_in: change.fullDocument.amount_in,
          amount_out: change.fullDocument.amount_out,
          price: change.fullDocument.price,
          gas_fee: change.fullDocument.gas_fee,
          network_fee: change.fullDocument.network_fee,
          platform_fee: change.fullDocument.platform_fee,
          receipt_hash: change.fullDocument.receipt_hash,
          status: change.fullDocument.status,
          createdAt: change.fullDocument.createdAt,
        };
        personalNamespace.to(updateDocument.from_wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
        if (change.fullDocument.status === "Completed") {
          generalNamespace.emit("updateTokenTransactions", {
            data: updateDocument,
          });
          if (
            ["Swap Token", "Buy Token", "Sell Token"].includes(
              updateDocument.type
            )
          ) {
            generalNamespace.emit("updatePoolTransactions", {
              data: updateDocument,
            });
            await TokenController.updateTokenVolume(
              change.fullDocument.from_token_id
            );
            await PoolController.updatePoolVolume(change.fullDocument.pool_id);
          }
        }
      }
    }
  );

  LiquidityTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update", "insert"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          type: change.fullDocument.type,
          wallet: change.fullDocument.wallet,
          pool_id: await Pool.findById(change.fullDocument.pool_id),
          token1_id: await Token.findById(change.fullDocument.token1_id),
          token2_id: await Token.findById(change.fullDocument.token2_id),
          amount_token1: change.fullDocument.amount_token1,
          amount_token2: change.fullDocument.amount_token2,
          amount_lpt: change.fullDocument.amount_lpt,
          price: change.fullDocument.price,
          gas_fee: change.fullDocument.gas_fee,
          network_fee: change.fullDocument.network_fee,
          platform_fee: change.fullDocument.platform_fee,
          receipt_hash: change.fullDocument.receipt_hash,
          status: change.fullDocument.status,
          createdAt: change.fullDocument.createdAt,
        };
        personalNamespace.to(updateDocument.wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
        if (change.fullDocument.status === "Completed") {
          generalNamespace.emit("updatePoolTransactions", {
            data: updateDocument,
          });
          await PoolController.updatePoolTVL(change.fullDocument.pool_id);
        }
      }
    }
  );

  UsdTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update", "insert"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          type: change.fullDocument.type,
          method: change.fullDocument.method,
          wallet: change.fullDocument.wallet,
          amount: change.fullDocument.amount,
          currency: change.fullDocument.currency,
          order_id: change.fullDocument.order_id,
          invoice_id: change.fullDocument.invoice_id,
          payer_email: change.fullDocument.payer_email,
          payee_email: change.fullDocument.payee_email,
          gas_fee: change.fullDocument.gas_fee,
          network_fee: change.fullDocument.network_fee,
          platform_fee: change.fullDocument.platform_fee,
          receipt_hash: change.fullDocument.receipt_hash,
          status: change.fullDocument.status,
          createdAt: change.fullDocument.createdAt,
        };
        personalNamespace.to(updateDocument.wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
      }
    }
  );

  NftTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      console.log("Change is this: ", change.fullDocument);
      if (["update", "insert"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          type: change.fullDocument.type,
          from_wallet: change.fullDocument.from_wallet,
          to_wallet: change.fullDocument.to_wallet,
          collection_id: await Collection.findById(
            change.fullDocument.collection_id
          ),
          nft_id: change.fullDocument.nft_id,
          price: change.fullDocument.price,
          currency: change.fullDocument.currency,
          gas_fee: change.fullDocument.gas_fee,
          network_fee: change.fullDocument.network_fee,
          platform_fee: change.fullDocument.platform_fee,
          receipt_hash: change.fullDocument.receipt_hash,
          status: change.fullDocument.status,
          createdAt: change.fullDocument.createdAt,
        };
        personalNamespace.to(updateDocument.from_wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
        if (
          change.operationType === "update" &&
          updateDocument.status === "Completed"
        ) {
          generalNamespace.emit("updateNFTItemTransactions", {
            data: updateDocument,
          });
          if (change.fullDocument.type === "Buy NFT") {
            await CollectionController.updateInfoCollection(
              change.fullDocument.collection_id
            );
          }
        }
      }
    }
  );

  Order.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (["update"].includes(change.operationType)) {
        const updateDocument = {
          _id: change.fullDocument._id,
          type: change.fullDocument.type,
          order_id: change.fullDocument.order_id,
          from_wallet: change.fullDocument.from_wallet,
          to_wallet: change.fullDocument.to_wallet,
          pool_id: change.fullDocument.pool_id,
          from_token_id: await Token.findById(
            change.fullDocument.from_token_id
          ),
          to_token_id: await Token.findById(change.fullDocument.to_token_id),
          amount_in: change.fullDocument.amount_in,
          amount_out: change.fullDocument.amount_out,
          price: change.fullDocument.price,
          status: change.fullDocument.status,
          receipt_hash: change.fullDocument.receipt_hash,
          expiredAt: change.fullDocument.expiredAt,
          createdAt: change.fullDocument.createdAt,
        };
        personalNamespace.to(updateDocument.from_wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
        if (["Failed", "Completed"].includes(change.fullDocument.status)) {
          await TransactionController.addOrderTransaction(
            change.fullDocument._id
          );
        }
      }
    }
  );

  // Xứ lý kết nối

  generalNamespace.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.emit("message", `Connected general is ok ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  personalNamespace.on("connection", (socket) => {
    const { wallet } = socket.handshake.query;
    console.log("A Personal connected", wallet, socket.id);
    if (wallet) {
      socket.join(wallet);
    }

    socket.emit("message", `Connected personal is ok ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
}
module.exports = socket;
