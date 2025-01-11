const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const PendingNFT = new Schema(
  {
    pending_collection_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "pendingcollection",
    },
    category: { type: String, required: true },
    nft_id: { type: String, required: true },
    name: { type: String, required: false, maxLength: 255 },
    uri: { type: String, required: true, maxLength: 255 },
    img: { type: String, required: false, maxLength: 255 },
    price: { type: String, default: "0" },
    ai_price: { type: String, default: "0" },
    expert_price: { type: String, default: "0" },
    description: { type: String, required: false, default: "" },
  },
  {
    timestamps: true,
  }
);

PendingNFT.index({ owner: "text" });

//Custom query helpers
PendingNFT.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
PendingNFT.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("pendingnft", PendingNFT);
