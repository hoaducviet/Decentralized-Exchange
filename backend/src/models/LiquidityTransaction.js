const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const LiquidityTransaction = new Schema(
  {
    type: {
      type: String,
      enum: ["Add Liquidity", "Remove Liquidity"],
      required: true,
    },
    wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    pool_id: { type: Schema.Types.ObjectId, required: true, ref: "pool" },
    token1_id: { type: Schema.Types.ObjectId, required: true, ref: "token" },
    token2_id: { type: Schema.Types.ObjectId, required: false, ref: "token" },
    amount_token1: { type: String, required: true },
    amount_token2: { type: String, required: true },
    amount_lpt: { type: String, required: true },
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

LiquidityTransaction.index(
  { type: "text", wallet: "text" },
  { weights: { type: 1, wallet: 1 } }
);

//Custom query helpers
LiquidityTransaction.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
LiquidityTransaction.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("liquiditytransaction", LiquidityTransaction);
