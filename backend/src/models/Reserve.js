const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const Reserve = new Schema(
  {
    pool_id: { type: Schema.Types.ObjectId, required: true, ref: "pool" },
    reserve_token1: { type: String, required: true, default: 0 },
    reserve_token2: { type: String, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

//Custom query helpers
Reserve.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Reserve.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("reserve", Reserve);
