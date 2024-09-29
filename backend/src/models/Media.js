const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Media = new Schema(
  {
    title: { type: String, unique: true, required: true, maxLength: 255 },
    detail: { type: String, required: true, maxLength: 600 },
    videoURL: { type: String, required: true, maxLength: 255 },
    trailerURL: { type: String, required: true, maxLength: 255 },
    posterURL: { type: String, required: true, maxLength: 255 },
    imageURL: { type: String, required: true, maxLength: 255 },
    ageRestriction: { type: String, maxLength: 20 },
    type: { type: String },
    label: { type: String, required: true },
    genre: { type: String },
    country: { type: String },
    language: { type: String },
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
