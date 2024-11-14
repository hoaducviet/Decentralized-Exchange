const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Collection = new Schema(
  {
    name: { type: String, unique: true, required: true, maxLength: 255 },
    symbol: { type: String, unique: true, required: true, maxLength: 20 },
    img: { type: String, unique: false, required: false, maxLength: 255 },
    uri: { type: String, unique: false, required: false, maxLength: 255 },
    address: { type: String, required: true, minLength: 42, maxLength: 42 },
    owner: { type: String, required: false, minLength: 42, maxLength: 42 },
    total_supply: { type: String, required: false, default: 0 },
    description: { type: String, required: false, maxLength: 255, default: "" },
    volume: { type: String, required: false, default: 0 },
  },
  {
    timestamps: true,
  }
);

Collection.index({ name: "text", symbol: "text" });

//Custom query helpers
Collection.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Collection.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("collection", Collection);
