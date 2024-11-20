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
