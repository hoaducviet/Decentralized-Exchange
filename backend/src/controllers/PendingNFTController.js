const Collection = require("../models/Collection");
const NFT = require("../models/NFT");
const Trait = require("../models/Trait");
const CollectionController = require("../controllers/CollectionController");
const WalletController = require("./WalletController");
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require("../utils/mongoose");
const PendingNFT = require("../models/PendingNFT");
const PendingTrait = require("../models/PendingTrait");

class PendingNFTController {
  async getPendingNFTItem(req, res) {
    try {
      const { collection, nft } = req.query;
      const result = await PendingNFT.findOne({
        pending_collection_id: collection,
        nft_id: nft,
      }).lean();
      let traits = await PendingTrait.find({
        pending_collection_id: collection,
        nft_id: nft,
      });
      traits =
        traits.map(({ trait_type, value }) => ({ trait_type, value })) || [];

      if (!result) {
        return res.status(404).json({ message: "Collection's nft is null" });
      }

      const response = { ...result, traits };
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error collection:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getPendingNFTsByCollection(req, res) {
    try {
      const { id } = req.params;
      const results = await PendingNFT.find({ pending_collection_id: id })
        .select(
          "_id pending_collection_id nft_id name uri img price ai_price expert_price description createdAt"
        )
        .exec();
      if (!results.length) {
        return res.status(404).json({ message: "Collection's nft is null" });
      }

      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error NFT:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all NFT" });
    }
  }

  async updatePriceExpertNFTs(req, res) {
    try {
      const nfts = req.body;
      console.log(nfts);

      if (!Array.isArray(nfts)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of Nfts objects.",
        });
      }
      const newUpdate = await Promise.all(
        nfts.map(async (item) => {
          return await PendingNFT.findOneAndUpdate(
            {
              pending_collection_id: item.pending_collection_id,
              nft_id: item.nft_id,
            },
            {
              expert_price: item.expert_price,
            },
            { new: true }
          );
        })
      );

      console.log(newUpdate);
      return res.status(201).json({
        message: "NFTs data added successfully",
        data: mutipleMongooseToObject(newUpdate),
      });
    } catch (error) {
      console.error("Error NFT:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all NFT" });
    }
  }
}

module.exports = new PendingNFTController();
