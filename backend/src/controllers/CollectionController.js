const Collection = require("../models/Collection");
const NftTransaction = require("../models/NftTransaction");
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
      console.log(newCollections);
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
        // Kiểm tra tồn tại của collection chưa
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
      const collections = await Collection.find();
      if (
        newCollections.length === collections.length &&
        validCollection.length <= 0
      ) {
        return res.status(200).json({
          message: "All collection has updated",
          errors,
        });
      }
      console.log("Collection valid: ", validCollection);
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

  async getCollectionByAddress(req, res) {
    try {
      const { address } = req.params;
      const results = await Collection.find({ owner: address, active: true })
        .select(
          "_id address owner category name symbol logo banner verified currency project_url discord_url floor_price highest_price total_items total_listed total_owners twitter_username instagram_username description volume active createdAt"
        )
        .exec();

      return res.status(200).json(mutipleMongooseToObject(results || []));
    } catch (error) {
      console.error("Error Collection:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all Collection" });
    }
  }

  async getCollectionAll(req, res) {
    try {
      const results = await Collection.find({ active: true })
        .select(
          "_id address owner category name symbol logo banner verified currency project_url discord_url floor_price highest_price total_items total_listed total_owners twitter_username instagram_username description volume createdAt"
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

  async getCollectionSuspended(req, res) {
    try {
      const results = await Collection.find({ active: false })
        .select(
          "_id address owner category name symbol logo banner verified currency project_url discord_url floor_price highest_price total_items total_listed total_owners twitter_username instagram_username description volume createdAt"
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

    const volume = (
      await NftTransaction.find({
        collection_id: _id,
        type: "Buy NFT",
        status: "Completed",
      })
    )
      .reduce((sum, transaction) => sum + parseFloat(transaction.price), 0)
      .toString();

    const updateData = {
      floor_price: Math.min(...prices),
      highest_price: Math.max(...prices),
      total_items: nfts.length,
      total_listed: listed.length,
      total_owners: owners.size,
      volume,
    };

    await Collection.findByIdAndUpdate(_id, updateData);
    return;
  }

  async getCollectionTop(req, res) {
    try {
      const collections = await Collection.aggregate([
        {
          $addFields: {
            volume: { $toDouble: "$volume" },
          },
        },
        {
          $sort: { volume: -1 },
        },
        {
          $limit: 6,
        },
      ]);

      const results = await Promise.all(
        collections.map(async (collection) => {
          const nftTransactions = await NftTransaction.aggregate([
            { $match: { collection_id: collection._id, status: "Completed" } },
            { $group: { _id: "$nft_id", transactionCount: { $sum: 1 } } },
            { $sort: { transactionCount: -1 } },
            { $limit: 5 },
          ]);

          const nftIds = nftTransactions.map((item) => item._id);
          const nfts =
            nftIds.length > 0
              ? await NFT.find({
                  collection_id: collection._id,
                  nft_id: { $in: nftIds },
                })
              : [];

          return {
            collection,
            nfts,
          };
        })
      );

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error Collection:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all Collection" });
    }
  }

  async deleteCollection(req, res) {
    try {
      const { _id } = req.body;
      const collection = await Collection.findById(_id);
      if (!collection) {
        return res.status(404).json({ message: "Collection is null" });
      }
      await Collection.findByIdAndUpdate(_id, { active: false });
      return res.status(200).json({ message: "Deleted Collection" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Collection" });
    }
  }

  async activeCollection(req, res) {
    try {
      const { _id } = req.body;
      const collection = await Collection.findById(_id);
      if (!collection) {
        return res.status(404).json({ message: "Collection is null" });
      }
      await Collection.findByIdAndUpdate(_id, { active: true });
      return res.status(200).json({ message: "Active Collection" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Collection" });
    }
  }
}

module.exports = new CollectionController();
