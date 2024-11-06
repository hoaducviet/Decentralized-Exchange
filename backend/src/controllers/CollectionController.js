const Collection = require("../models/Collection");
const WalletController = require("./WalletController");

const { mutipleMongooseToObject } = require("../utils/mongoose");

class CollectionController {
  async updateCollection(req, res) {
    console.log("collection");
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
        if (!collection.name || !collection.address || !collection.symbol) {
          errors.push({ collection, error: "Missing required fields" });
          continue;
        }

        // Kiểm tra tồn tại của pool chưa
        let existCollection = await Collection.findOne({
          address: collection.address,
          name: collection.name,
          symbol: collection.symbol,
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

      if (errors.length) {
        return res.status(400).json({
          message: "Some collection items could not be added",
          errors,
        });
      }

      const results = await Collection.insertMany(validCollection);
      return res.status(201).json({
        message: "Collection data added successfully",
        data: mutipleMongooseToObject(results),
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
          "_id name symbol img address owner total_supply description volume"
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
}

module.exports = new CollectionController();
