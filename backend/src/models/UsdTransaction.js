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
    },
    wallet: {
      type: String,
      required: false,
      minLength: 42,
      maxLength: 42,
      required: true,
    },
    amount: { type: String, required: true, default: "" },
    currency: { type: String, required: true, default: "USD" },
    order_id: { type: String, required: false, default: "" },
    invoice_id: { type: String, required: false },
    payer_email: { type: String, required: true },
    payee_email: { type: String, required: false },
    gas_fee: { type: String, required: false, default: "" },
    network_fee: { type: String, required: false, default: "" },
    platform_fee: { type: String, required: false, default: "0.3%" },
    receipt_hash: {
      type: String,
      required: function () {
        return this.status === "Completed";
      },
      maxLength: 255,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
    notes: { type: String, required: false, default: "" },
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
