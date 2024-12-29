const Collection = require("../models/Collection");
const NftTransaction = require("../models/NftTransaction");
const PendingCollection = require("../models/PendingCollection");
const NFT = require("../models/NFT");
const WalletController = require("./WalletController");

const { mutipleMongooseToObject } = require("../utils/mongoose");
const { fetchDataURI } = require("../utils/fetchDataURI");
const { convertToHttps } = require("../utils/convertToHttps");
const PendingNFT = require("../models/PendingNFT");
const PendingTrait = require("../models/PendingTrait");

class PendingCollectionController {
  async registerPendingCollection(req, res) {
    try {
      const fileCollection = req.body;
      const collectionRaw = await fetchDataURI({ uri: fileCollection.uri });

      const collection = {
        owner: fileCollection.owner,
        name: collectionRaw.name,
        symbol: collectionRaw.symbol,
        uri: fileCollection.uri,
        base_url: fileCollection.base_url,
        end_url: fileCollection.end_url,
        logo: collectionRaw.collection_logo,
        banner: collectionRaw.collection_banner_image,
        project_url: collectionRaw.project_url || "",
        discord_url: collectionRaw.discord_url || "",
        total_items: fileCollection.nfts.length || "",
        twitter_username: collectionRaw.twitter_username || "",
        instagram_username: collectionRaw.instagram_username || "",
      };

      const newCollection = await PendingCollection(collection).save();
      const nfts = await Promise.all(
        fileCollection.nfts.map(async (item) => {
          const url = `${fileCollection.base_url}${item.token_uri}${fileCollection.end_url}`;
          const response = await fetchDataURI({ uri: url });
          const img = response.image
            ? await convertToHttps({ uri: response.image })
            : "";
          return {
            pending_collection_id: newCollection._id,
            nft_id: item.token_id,
            name: response.name || "",
            uri: url,
            img: img || "",
            description: response.description || "",
            attributes: response.attributes || [],
          };
        })
      );

      if (!Array.isArray(nfts)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of Nfts objects.",
        });
      }
      const validNFT = [];
      const errors = [];
      const validAttributes = [];

      for (let nft of nfts) {
        if (!nft.pending_collection_id || !nft.nft_id || !nft.uri) {
          errors.push({ nft, error: "Missing required fields" });
          continue;
        }

        // // Kiểm tra tồn tại của pool chưa
        let existNFT = await NFT.findOne({
          pending_collection_id: nft.pending_collection_id,
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
            pending_collection_id: nft.pending_collection_id,
            nft_id: nft.nft_id,
            trait_type,
            value,
          }));
          validAttributes.push(...attrs);
        }
      }

      if (validNFT.length <= 0) {
        return res.status(200).json({
          message: "All nfts has updated",
          errors,
        });
      }

      const results = await PendingNFT.insertMany(validNFT);
      await PendingTrait.insertMany(validAttributes);
      await PendingCollection.findByIdAndUpdate(newCollection._id, {
        total_items: results.length,
      });

      return res.status(200).json({ message: "Add success!" });
    } catch (error) {
      console.error("Error collection:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getWaitingPendingCollection(req, res) {
    try {
      const results = await PendingCollection.find({ status: "Pending" })
        .select(
          "_id owner name symbol logo banner currency project_url discord_url total_items twitter_username instagram_username description status createdAt"
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

  async getAcceptPendingCollection(req, res) {
    try {
      const results = await PendingCollection.find({ status: "Accepted" })
        .select(
          "_id owner name symbol logo banner currency project_url discord_url total_items twitter_username instagram_username description status createdAt"
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

  async getRejectPendingCollection(req, res) {
    try {
      const results = await PendingCollection.find({ status: "Rejected" })
        .select(
          "_id owner name symbol logo banner currency project_url discord_url total_items twitter_username instagram_username description status createdAt"
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

  async getPendingCollectionByAddress(req, res) {
    try {
      const { address } = req.params;
      const results = await PendingCollection.find({ owner: address })
        .select(
          "_id owner name symbol logo banner currency project_url discord_url total_items twitter_username instagram_username description status createdAt"
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

  async rejectCollection(req, res) {
    try {
      const { _id } = req.body;
      console.log(_id);
      const collection = await PendingCollection.findById(_id);
      if (!collection) {
        return res.status(404).json({ message: "Collection is null" });
      }
      await PendingCollection.findByIdAndUpdate(_id, { status: "Rejected" });
      return res.status(200).json({ message: "Rejected Collection" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Collection" });
    }
  }

  async acceptCollection(req, res) {
    try {
      const { _id } = req.body;
      const collection = await PendingCollection.findById(_id);
      if (!collection) {
        return res.status(404).json({ message: "Collection is null" });
      }
      await PendingCollection.findByIdAndUpdate(_id, { status: "Accepted" });
      return res.status(200).json({ message: "Accepted Collection" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Collection" });
    }
  }

  async waitCollection(req, res) {
    try {
      const { _id } = req.body;
      const collection = await PendingCollection.findById(_id);
      if (!collection) {
        return res.status(404).json({ message: "Collection is null" });
      }
      await PendingCollection.findByIdAndUpdate(_id, { status: "Pending" });
      return res.status(200).json({ message: "Pending Collection" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Collection" });
    }
  }
}

module.exports = new PendingCollectionController();