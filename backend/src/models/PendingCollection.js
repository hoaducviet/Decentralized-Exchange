const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const PendingCollection = new Schema(
  {
    from_wallet: { type: String, required: true, minLength: 42, maxLength: 42 },
    owner: { type: String, required: true, minLength: 42, maxLength: 42 },
    name: { type: String, unique: true, required: true, maxLength: 255 },
    symbol: { type: String, unique: true, required: true, maxLength: 20 },
    uri: { type: String, unique: true, required: true, maxLength: 255 },
    logo: { type: String, unique: true, required: false, maxLength: 255 },
    banner: { type: String, unique: true, required: true, maxLength: 255 },
    currency: { type: String, maxLength: 255, default: "ETH" },
    project_url: { type: String, maxLength: 255, default: "" },
    discord_url: { type: String, maxLength: 255, default: "" },
    total_items: { type: String, default: "0" },
    twitter_username: { type: String, maxLength: 255, default: "" },
    instagram_username: { type: String, maxLength: 255, default: "" },
    description: { type: String, required: false, maxLength: 255, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Failed"],
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
