const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const NFT = new Schema(
  {
    collection_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "collection",
    },
    owner: { type: String, required: true, minLength: 42, maxLength: 42 },
    category: { type: String, required: true },
    nft_id: { type: String, required: true },
    name: { type: String, required: false, maxLength: 255 },
    uri: { type: String, required: true, maxLength: 255 },
    animation: { type: String, required: false, maxLength: 255 },
    img: { type: String, required: false, maxLength: 255 },
    price: { type: String, default: "0" },
    formatted: { type: String, default: "0" },
    isListed: { type: Boolean, required: true },
    description: { type: String, required: false, default: "" },
    has_physical: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

NFT.index({ owner: "text" });

//Custom query helpers
NFT.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
NFT.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("nft", NFT);
