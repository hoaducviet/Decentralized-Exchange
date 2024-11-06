const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const NftTransaction = new Schema(
  {
    type: {
      type: String,
      enum: ["Buy NFT", "Listed NFT", "Withdraw NFT", "Transfer NFT"],
      required: true,
    },
    wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    collection_id: { type: Schema.Types.ObjectId, required: true, ref: "collection" },
    nft_id: { type: Schema.Types.Decimal128, required: true },
    price: { type: String, required: true },
    currency: { type: String, required: true, default: "ETH" },
    gas_fee: { type: String, required: true },
    network_fee: { type: String, required: true },
    platform_fee: { type: String, required: true },
    receipt_hash: {
      type: String,
      required: function () {
        return this.status === "Completed";
      },
      maxLength: 255,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

NftTransaction.index(
  { type: "text", wallet: "text" },
  { weights: { type: 1, wallet: 1 } }
);

//Custom query helpers
NftTransaction.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
NftTransaction.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("nfttransaction", NftTransaction);
