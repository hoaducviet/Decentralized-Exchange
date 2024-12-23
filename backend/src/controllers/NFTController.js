const Collection = require("../models/Collection");
const NFT = require("../models/NFT");
const Trait = require("../models/Trait");
const CollectionController = require("../controllers/CollectionController");
const WalletController = require("./WalletController");
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require("../utils/mongoose");

class NFTController {
  async updateNFT(req, res) {
    try {
      const nfts = await WalletController.getNFTAll();

      console.log(nfts.length);

      if (!Array.isArray(nfts)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of Nfts objects.",
        });
      }

      const validNFT = [];
      const errors = [];
      const validAttributes = [];

      for (let nft of nfts) {
        if (
          !nft.collection_id ||
          !nft.nft_id ||
          !nft.uri ||
          !nft.img.includes("/")
        ) {
          errors.push({ nft, error: "Missing required fields" });
          continue;
        }

        // Kiểm tra tồn tại của pool chưa
        let existNFT = await NFT.findOne({
          collection_id: nft.collection_id,
          nft_id: nft.nft_id,
          uri: nft.uri,
        });
        const { attributes, ...info } = nft;

        if (existNFT) {
          errors.push({
            info,
            error: "NFT with this name already exists",
          });
          continue;
        }
        validNFT.push(info);
        if (nft.attributes.length) {
          const attrs = attributes.map(({ trait_type, value }) => ({
            collection_id: nft.collection_id,
            nft_id: nft.nft_id,
            trait_type,
            value,
          }));
          validAttributes.push(...attrs);
        }
      }

      console.log("Valid: ", validNFT.length, "Error: ", errors.length);

      if (validNFT.length === 0) {
        return res.status(400).json({
          message: "Some nfts items could not be added",
          data: { errors: errors },
        });
      }
      const results = await NFT.insertMany(validNFT);
      const traits = await Trait.insertMany(validAttributes);
      const collections = await Collection.find();
      if (results) {
        collections.map((item) => {
          CollectionController.updateInfoCollection(item._id);
        });
      }
      return res.status(201).json({
        message: "NFTs data added successfully",
        data: {
          results: mutipleMongooseToObject(results),
          attributes: mutipleMongooseToObject(traits),
          errors: errors,
        },
      });
    } catch (error) {
      console.error("Error collection:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getNFTItem(req, res) {
    try {
      const { collection, nft } = req.query;
      const result = await NFT.findOne({
        collection_id: collection,
        nft_id: nft,
      }).lean();
      let traits = await Trait.find({
        collection_id: collection,
        nft_id: nft,
      });
      traits = traits.map(({ trait_type, value }) => ({ trait_type, value }));

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

  async getNFTsByCollection(req, res) {
    try {
      const { id } = req.params;
      const results = await NFT.find({ collection_id: id })
        .select(
          "_id collection_id owner nft_id name uri img price formatted isListed description createdAt"
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
}

module.exports = new NFTController();
