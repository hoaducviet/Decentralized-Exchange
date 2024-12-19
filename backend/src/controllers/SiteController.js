const Token = require("../models/Token.js");
const Collection = require("../models/Collection.js");
const TokenPrice = require("../models/TokenPrice.js");

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

      const tokensNeed = await Token.find({
        $and: [
          {
            $or: [
              { name: { $regex: `.*${q}.*`, $options: "i" } },
              { symbol: { $regex: `.*${q}.*`, $options: "i" } },
            ],
          },
          { symbol: { $ne: "USD" } }, // Điều kiện name khác USD
        ],
      })
        .sortable(req)
        .limit(5)
        .lean();

      const tokenIds = tokensNeed.map((item) => item._id);

      const tokens = await TokenPrice.aggregate([
        { $sort: { token_id: 1, createdAt: -1 } },
        {
          $match: {
            token_id: { $in: tokenIds },
          },
        },
        {
          $group: {
            _id: "$token_id",
            price: { $first: "$price" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "tokens",
            localField: "_id",
            foreignField: "_id",
            as: "info",
          },
        },
        {
          $unwind: "$info",
        },
        {
          $project: {
            _id: "$_id",
            price: "$price",
            name: "$info.name",
            symbol: "$info.symbol",
            img: "$info.img",
            decimals: "$info.decimals",
            address: "$info.address",
            owner: "$info.owner",
            volume: "$info.volume",
            price_reference: "$info.price_reference",
            total_supply: "$info.total_supply",
            createdAt: 1,
          },
        },
      ]);

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
        tokens: tokens || [],
        nfts: mutipleMongooseToObject(nfts) || [],
      });
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new SiteController();
