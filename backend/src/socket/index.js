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
const TokenTransaction = require("../models/TokenTransaction");
const LiquidityTransaction = require("../models/LiquidityTransaction");
const UsdTransaction = require("../models/UsdTransaction");
const NftTransaction = require("../models/NftTransaction");

function socket(io) {
  Token.watch().on("change", (change) => {
    console.log(change);
    console.log("Full doc:", change.fullDocument);
    io.emit("transaction", change.fullDocument);
  });

  Reserve.watch([], { fullDocument: "updateLookup" }).on("change", (change) => {
    if (["update", "insert"].includes(change.operationType)) {
      const updateDocument = {
        pool_id: change.fullDocument.pool_id,
        reserve1: change.fullDocument.reserve_token1,
        reserve2: change.fullDocument.reserve_token2,
      };
      console.log(updateDocument);
      io.emit("updateReserves", { data: updateDocument });
    }
  });

  TokenTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      const updateDocument = {
        _id: change.fullDocument._id,
        type: change.fullDocument.type,
        from_wallet: change.fullDocument.from_wallet,
        to_wallet: change.fullDocument.to_wallet,
        from_token_id: await Token.findById(change.fullDocument.from_token_id),
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
      if (["update", "insert"].includes(change.operationType)) {
        io.to(updateDocument.from_wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
        if (change.fullDocument.status === "Completed") {
          io.emit("updateTokenTransactions", { data: updateDocument });
        }
      }
    }
  );

  LiquidityTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
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
      if (["update", "insert"].includes(change.operationType)) {
        io.to(updateDocument.wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
      }
    }
  );

  UsdTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
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
      if (["update", "insert"].includes(change.operationType)) {
        io.to(updateDocument.wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
      }
    }
  );

  NftTransaction.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
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
      if (["update", "insert"].includes(change.operationType)) {
        io.to(updateDocument.from_wallet).emit("updateActiveTransactions", {
          data: updateDocument,
        });
      }
    }
  );

  // Xứ lý kết nối
  io.on("connection", (socket) => {
    const { wallet } = socket.handshake.query;
    console.log("A user connected", wallet, socket.id);
    if (wallet) {
      socket.join(wallet);
      console.log(`Socket ${socket.id} joined room ${wallet}`);
    }

    socket.emit("message", "Connected is ok");

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
}
module.exports = socket;