const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Account = new Schema(
  {
    address: { type: String, required: true, minLength: 42, maxLength: 42 },
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
Account.query.sortable = function (req) {
  if (req.query.hasOwnProperty("_sort")) {
    const isValidType = ["asc", "desc"].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : "desc",
    });
  }
  return this;
};

//Add Plugin
Account.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("account", Account);
