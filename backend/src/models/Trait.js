const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const Trait = new Schema(
  {
    nft_id: { type: Schema.Types.ObjectId, required: true, ref: "nft" },
    trait_type: { type: String, required: true, default: "" },
    value: { type: String, required: false, default: "" },
  },
  {
    timestamps: true,
  }
);

//Custom query helpers
Trait.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Trait.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("trait", Trait);
