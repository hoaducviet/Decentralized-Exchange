const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Order = new Schema(
  {
    order_id: { type: Number, required: false, default: -1 },
    wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    pool_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "pool",
    },
    from_token_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "token",
    },
    to_token_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "token",
    },
    amount_in: { type: String, require: true },
    amount_out: { type: String, require: false, default: "" },
    price: { type: String, require: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: false,
      default: "Pending",
    },
    receipt_hash: { type: String, require: false, default: "" },
    expiredAt: { type: Date, require: false, default: "" },
  },
  {
    timestamps: true,
  }
);

Order.index({ wallet: "text", order_id: "text" });

//Custom query helpers
Order.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Order.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("order", Order);
