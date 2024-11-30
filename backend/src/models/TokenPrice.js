const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const TokenPrice = new Schema(
  {
    token_id: { type: Schema.Types.ObjectId, required: true, ref: "token" },
    price: { type: String, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

//Custom query helpers
TokenPrice.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
TokenPrice.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("tokenprice", TokenPrice);
