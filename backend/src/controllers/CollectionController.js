const Collection = require("../models/Collection");
const NFT = require("../models/NFT");
const WalletController = require("./WalletController");

const { mutipleMongooseToObject } = require("../utils/mongoose");

class CollectionController {
  async updateCollection(req, res) {
    try {
      const newCollections = await WalletController.getCollections();

      if (!Array.isArray(newCollections)) {
        return res.status(400).json({
          message:
            "Invalid data format. Expected an array of collections objects.",
        });
      }

      const validCollection = [];
      const errors = [];

      for (let collection of newCollections) {
        if (
          !collection.name ||
          !collection.address ||
          !collection.symbol ||
          !collection.uri
        ) {
          errors.push({ collection, error: "Missing required fields" });
          continue;
        }

        // Kiểm tra tồn tại của pool chưa
        let existCollection = await Collection.findOne({
          address: collection.address,
          name: collection.name,
          symbol: collection.symbol,
          uri: collection.uri,
        });

        if (existCollection) {
          errors.push({
            collection,
            error: "Collection with this name already exists",
          });
          continue;
        }
        validCollection.push(collection);
      }

      if (validCollection.length === 0) {
        return res.status(400).json({
          message: "Some collection items could not be added",
          errors,
        });
      }
      const results = await Collection.insertMany(validCollection);
      return res.status(201).json({
        message: "Collection data added successfully",
        data: { results: mutipleMongooseToObject(results), errors: errors },
      });
    } catch (error) {
      console.error("Error collection:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCollectionAll(req, res) {
    try {
      const results = await Collection.find()
        .select(
          "_id address owner name symbol logo banner verified currency project_url discord_url floor_price highest_price total_items total_listed total_owners twitter_username instagram_username description volume createdAt"
        )
        .exec();
      if (!results.length) {
        return res.status(404).json({ message: "Collection is null" });
      }

      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error Collection:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all Collection" });
    }
  }

  //Tính giá và các thông tin khác
  async updateInfoCollection(_id) {
    const nfts = await NFT.find({ collection_id: _id }).lean();
    const listed = nfts.filter((item) => item.isListed && item.formatted);
    const prices = listed.map((item) => parseFloat(item.formatted || "0"));
    const owners = new Set(nfts.map((item) => item.owner));

    const updateData = {
      floor_price: Math.min(...prices),
      highest_price: Math.max(...prices),
      total_items: nfts.length,
      total_listed: listed.length,
      total_owners: owners.size,
    };
    
    await Collection.findByIdAndUpdate(_id, updateData);
    return;
  }
}

module.exports = new CollectionController();
