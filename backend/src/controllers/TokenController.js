const Token = require("../models/Token");
const TokenPrice = require("../models/TokenPrice.js");
const WalletController = require("./WalletController");
const { mutipleMongooseToObject } = require("../utils/mongoose");
const PoolController = require("./PoolController");

class TokenController {
  async updateToken(req, res) {
    try {
      const newTokens = await WalletController.getTokens();
      if (!Array.isArray(newTokens)) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of tokens objects.",
        });
      }

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
      if (errors.length) {
        return res.status(400).json({
          message: "Some token items could not be added",
          errors,
        });
      }

      const results = await Token.insertMany(validToken);

      const usdToken = results.find((item) => item.symbol === "USD");
      console.log();
      const newUsdPrice = new TokenPrice({
        token_id: usdToken._id,
        price: "1",
      });
      newUsdPrice.save();

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
      const results = await Token.find().select(
        "_id name symbol img decimals address owner volume"
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
}

module.exports = new TokenController();
