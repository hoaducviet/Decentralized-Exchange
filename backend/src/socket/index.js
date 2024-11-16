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


  // Xứ lý kết nối
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("message", (data) => {
      console.log("Received from clien", data);
    });

    socket.emit("message", "Connected is ok");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
module.exports = socket;
