const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const PendingTrait = new Schema(
  {
    pending_collection_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "pendingcollection",
    },
    nft_id: { type: String, required: true },
    trait_type: { type: String, required: false, default: "" },
    value: { type: String, required: false, default: "" },
  },
  {
    timestamps: true,
  }
);

//Custom query helpers
PendingTrait.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
PendingTrait.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("pendingtrait", PendingTrait);
