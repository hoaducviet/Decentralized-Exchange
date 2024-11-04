const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Media = new Schema(
  {
    token_id: { type: Object, required: true },
    detail: { type: String, required: true, maxLength: 600 },
    videoURL: { type: String, required: true, maxLength: 255 },
    trailerURL: { type: String, required: true, maxLength: 255 },
    posterURL: { type: String, required: true, maxLength: 255 },
    imageURL: { type: String, required: true, maxLength: 255 },
    ageRestriction: { type: String, maxLength: 20 },
  },
  {
    timestamps: true,
  }
);

Media.index(
  { title: "text", detail: "text" },
  { weights: { title: 10, detail: 1 } }
);

//Custom query helpers
Media.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Media.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("media", Media);
