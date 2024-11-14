const Token = require("../models/Token.js");
const Collection = require("../models/Collection.js");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class SiteController {
  async search(req, res) {
    try {
      const q = req.query.q;

      if (!q) {
        return res.status(200).json({
          tokens: [],
          nfts: [],
        });
      }

      const tokens = await Token.find({
        $or: [
          { name: { $regex: `.*${q}.*`, $options: "i" } },
          { symbol: { $regex: `.*${q}.*`, $options: "i" } },
        ],
      })
        .sortable(req)
        .limit(5)
        .exec();

      const nfts = await Collection.find({
        $or: [
          { name: { $regex: `.*${q}.*`, $options: "i" } },
          { symbol: { $regex: `.*${q}.*`, $options: "i" } },
        ],
      })
        .sortable(req)
        .limit(5)
        .exec();
      return res.status(200).json({
        tokens: mutipleMongooseToObject(tokens) || [],
        nfts: mutipleMongooseToObject(nfts) || [],
      });
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new SiteController();
