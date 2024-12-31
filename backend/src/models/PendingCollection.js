const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const PendingCollection = new Schema(
  {
    owner: { type: String, required: true, minLength: 42, maxLength: 42 },
    name: { type: String, required: true, maxLength: 255 },
    symbol: { type: String, required: true, maxLength: 20 },
    uri: { type: String, required: true, maxLength: 255 },
    base_url: { type: String, required: true, maxLength: 255 },
    end_url: { type: String, maxLength: 255 },
    logo: { type: String, required: false, maxLength: 255 },
    banner: { type: String, required: true, maxLength: 255 },
    currency: { type: String, maxLength: 255, default: "ETH" },
    project_url: { type: String, maxLength: 255, default: "" },
    discord_url: { type: String, maxLength: 255, default: "" },
    total_items: { type: String, default: "0" },
    twitter_username: { type: String, maxLength: 255, default: "" },
    instagram_username: { type: String, maxLength: 255, default: "" },
    description: { type: String, required: false, maxLength: 255, default: "" },
    fee_expert: { type: String, required: false, default: "0.1" },
    payment_expert: { type: String, required: false, default: "0" },
    fee_market: { type: String, required: false, default: "0.5" },
    fee_mint: { type: String, required: false, default: "0" },
    total_fee: { type: String, required: false, default: "0" },
    payment_fee: { type: String, required: false, default: "" },
    admin_status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      required: false,
      default: "Pending",
    },
    user_status: {
      type: String,
      enum: ["Agreed", "Cancel", "Pending Expert", "Pending", "Payed Fee"],
      required: false,
      default: "Pending",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Canceled",
        "Created",
        "Failed",
        "Expert Price",
        "AI Price",
      ],
      required: false,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

PendingCollection.index({ name: "text", symbol: "text" });

//Custom query helpers
PendingCollection.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
PendingCollection.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("pendingcollection", PendingCollection);
