const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const TokenTransaction = new Schema(
  {
    type: { type: String, enum: ["Transfer", "Swap"], required: true },
    from_wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    to_wallet: { type: String, required: false, minLength: 42, maxLength: 42 },
    from_token_id: { type: Schema.ObjectId, required: true, ref: "token" },
    to_token_id: { type: Schema.ObjectId, required: false, ref: "token" },
    amount_in: { type: String, required: true },
    amount_out: { type: String, required: false },
    price: { type: String, required: false },
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
