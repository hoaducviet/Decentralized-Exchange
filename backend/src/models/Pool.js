const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Pool = new Schema(
  {
    name: { type: String, unique: true, required: true, maxLength: 255 },
    address: { type: String, required: true, minLength: 42, maxLength: 42 },
    address_lpt: { type: String, required: true, minLength: 42, maxLength: 42 },
    token1_id: { type: Schema.ObjectId, required: false, ref: "token" },
    token2_id: { type: Schema.ObjectId, required: false, ref: "token" },
    total_liquidity: { type: String, required: true, default: 0 },
    volume: { type: String, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

//Custom query helpers
Pool.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Pool.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("pool", Pool);
