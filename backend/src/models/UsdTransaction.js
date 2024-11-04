const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const UsdTransaction = new Schema(
  {
    type: {
      type: String,
      enum: ["Payment", "Payout"],
      required: true,
    },
    method: {
      type: String,
      enum: ["Paypal"],
      required: true,
      default: "Paypal",
    },
    wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    amount: { type: String, required: true },
    order_id: { type: String, required: true },
    payer_email: { type: String, required: true },
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
    notes: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

UsdTransaction.index(
  { type: "text", wallet: "text" },
  { weights: { type: 1, wallet: 1 } }
);

//Custom query helpers
UsdTransaction.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
UsdTransaction.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("usdtransaction", UsdTransaction);
