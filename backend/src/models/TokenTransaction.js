const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const TokenTransaction = new Schema(
  {
    type: {
      type: String,
      enum: [
        "Swap Token",
        "Transfer Token",
        "Buy Token",
        "Sell Token",
        "Swap Token Limit",
      ],
      required: true,
    },
    from_wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    to_wallet: { type: String, required: false, minLength: 42, maxLength: 42 },
    from_token_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "token",
    },
    to_token_id: { type: Schema.Types.ObjectId, required: false, ref: "token" },
    pool_id: { type: Schema.Types.ObjectId, required: false, ref: "pool" },
    amount_in: { type: String, required: true },
    amount_out: { type: String, required: false, default: "0" },
    price: { type: String, required: false, default: "0" },
    gas_fee: { type: String, required: false, default: "0" },
    network_fee: { type: String, required: false, default: "0" },
    platform_fee: { type: String, required: false, default: "0.3%" },
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
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

TokenTransaction.index(
  { type: "text", from_wallet: "text" },
  { weights: { type: 1, from_wallet: 1 } }
);

//Custom query helpers
TokenTransaction.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
TokenTransaction.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("tokentransaction", TokenTransaction);
