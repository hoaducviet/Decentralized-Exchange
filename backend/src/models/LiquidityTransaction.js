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
    token2_id: { type: Schema.Types.ObjectId, required: true, ref: "token" },
    amount_token1: { type: String, required: false },
    amount_token2: { type: String, required: false },
    amount_lpt: { type: String, required: false },
    gas_fee: { type: String, required: false },
    network_fee: { type: String, required: false },
    platform_fee: { type: String, required: false, default: "0.3%"},
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
      required: false,
      default: "Pending"
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
