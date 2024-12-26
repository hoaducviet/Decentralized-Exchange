const Token = require("../models/Token");
const TokenPrice = require("../models/TokenPrice.js");
const TokenTransaction = require("../models/TokenTransaction.js");
const WalletController = require("./WalletController");
const { mutipleMongooseToObject } = require("../utils/mongoose");
const PoolController = require("./PoolController");
const { ethers } = require("ethers");
const TokenERC20 = require("../artifacts/TokenERC20.json");

class TokenController {
  async updateToken(req, res) {
    try {
      const newTokens = await WalletController.getTokens();
      if (!Array.isArray(newTokens)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of tokens objects.",
        });
      }
      console.log("New tokens: ", newTokens);

      const validToken = [];
      const errors = [];
      for (let token of newTokens) {
        if (
          !token.name ||
          !token.symbol ||
          !token.img ||
          !token.decimals ||
          !token.address ||
          !token.owner
        ) {
          errors.push({ token, error: "Missing required fields" });
          continue;
        }

        // Kiểm tra tồn tại của token chưa
        let existToken = await Token.findOne({
          name: token.name,
          symbol: token.symbol,
          img: token.img,
          address: token.address,
        });

        if (existToken) {
          errors.push({
            token,
            error: "Token with this name already exists",
          });
          continue;
        }
        validToken.push(token);
      }
      console.log("Valid Token:", validToken);
      const tokens = await Token.find();
      if (newTokens.length === tokens.length && validToken.length <= 0) {
        return res.status(200).json({
          message: "All token has updated",
          errors,
        });
      }

      const results = await Token.insertMany(validToken);
      console.log(results);
      return res.status(200).json({
        message: "Token data added successfully",
        data: mutipleMongooseToObject(results),
      });
    } catch (error) {
      console.error("Error token:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getTokenAll(req, res) {
    try {
      const results = await Token.find({ active: true }).select(
        "_id name symbol img decimals address owner price price_reference total_supply volume deleted"
      );
      if (!results.length) {
        return res.status(404).json({ message: "Token is null" });
      }

      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error token:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all token" });
    }
  }

  async getTokenSuspended(req, res) {
    try {
      const results = await Token.find({ active: false }).select(
        "_id name symbol img decimals address owner price price_reference total_supply volume deleted"
      );
      if (!results.length) {
        return res.status(404).json({ message: "Token is null" });
      }

      return res.status(200).json(mutipleMongooseToObject(results));
    } catch (error) {
      console.error("Error token:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error get all token" });
    }
  }

  async updateTokenVolume(_id) {
    try {
      const volumes = await TokenTransaction.find({
        $or: [
          {
            from_token_id: _id,
          },
          {
            to_token_id: _id,
          },
        ],
        type: { $in: ["Swap Token", "Buy Token", "Sell Token"] },
        status: "Completed",
      });

      const volume = volumes.reduce(
        (sum, item) =>
          sum +
          parseFloat(
            item.from_token_id.toString() === _id.toString()
              ? item.amount_in
              : item.amount_out
          ),
        0
      );

      const result = await Token.findByIdAndUpdate(
        _id,
        {
          volume,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return;
    } catch (error) {
      console.error("Error Pool:", error.message);
      return;
    }
  }

  async updatePriceRefercence() {
    try {
      const prices = await TokenPrice.aggregate([
        { $sort: { token_id: 1, createdAt: -1 } },
        {
          $group: {
            _id: "$token_id",
            price: { $first: "$price" },
            createdAt: { $first: "$createdAt" },
          },
        },
      ]);

      const tokens = await Promise.all(
        prices.map(async (item) => {
          const token = await Token.findByIdAndUpdate(
            item._id,
            {
              price_reference: item.price,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          return token;
        })
      );
      console.log("Update Price reference", tokens.length);
    } catch (error) {
      console.error("Error Pool:", error.message);
      return;
    }
  }

  async updatePrice(newPrice) {
    try {
      const { token_id, price } = newPrice;
      await Token.findByIdAndUpdate(token_id, { price });

      console.log("Update Price Token");
      return;
    } catch (error) {
      console.error("Error Token:", error.message);
      return;
    }
  }

  async updateTotalSupply() {
    try {
      const tokens = await Token.find({ symbol: { $nin: ["ETH"] } });
      const results = await Promise.all(
        tokens.map(async (item) => {
          const erc20 = new ethers.Contract(
            item.address,
            TokenERC20.abi,
            WalletController.wallet
          );

          const supply = await erc20.totalSupply();
          const result = await Token.findByIdAndUpdate(
            item._id,
            {
              total_supply: ethers.formatUnits(supply, item.decimals),
            },
            {
              new: true,
              runValidators: true,
            }
          );
          return result;
        })
      );

      console.log("Update total supply", results.length);
    } catch (error) {
      console.error("Error Pool:", error.message);
      return;
    }
  }

  async deleteToken(req, res) {
    try {
      const { _id } = req.body;
      const token = await Token.findById(_id);
      if (!token) {
        return res.status(404).json({ message: "Token is null" });
      }
      await Token.findByIdAndUpdate(_id, { active: false });
      return res.status(200).json({ message: "Deleted Token" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Token" });
    }
  }

  async activeToken(req, res) {
    try {
      const { _id } = req.body;
      const token = await Token.findOne({ _id });
      if (!token) {
        return res.status(404).json({ message: "Token is null" });
      }
      await Token.findByIdAndUpdate(_id, { active: true });
      return res.status(200).json({ message: "Active Token" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Token" });
    }
  }

  async createToken(req, res) {
    try {
      const { name, symbol, img } = req.body;
      const existToken = await Token.findOne({
        name,
        symbol,
        img,
      });
      if (existToken) {
        return res.status(404).json({ message: "Token has existed!" });
      }
      const hash = await WalletController.createToken(req.body);
      return res.status(200).json({
        message: "Token created successfully",
        data: hash,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Token" });
    }
  }

  async addToken(req, res) {
    try {
      const { img, address } = req.body;
      const existToken = await Token.findOne({
        img,
        address,
      });
      if (existToken) {
        return res.status(404).json({ message: "Token has existed!" });
      }
      console.log(req.body);
      const hash = await WalletController.addToken(req.body);
      console.log(hash);
      return res.status(200).json({
        message: "Token added successfully",
        data: hash,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Token" });
    }
  }
}

module.exports = new TokenController();
