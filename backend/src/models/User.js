const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const User = new Schema(
  {
    username: { type: String, unique: true, required: true, maxLength: 255 },
    email: { type: String, required: true, maxLength: 255 },
    password_hash: { type: String, required: true, maxLength: 255 },
    role: {
      type: String,
      required: true,
      enum: ["admin", "staff", "manager", "developer"],
    },
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

//Custom query helpers
User.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
User.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("user", User);
