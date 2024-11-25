const TokenPrice = require("../models/TokenPrice.js");
const Token = require("../models/Token.js");

async function getPriceNftTransaction(amount) {
  const eth = await Token.findOne({ symbol: "ETH" });
  const ethPrice = await TokenPrice.findOne({ token_id: eth._id })
    .sort({ createdAt: -1 })
    .exec();
  return (parseFloat(amount) * parseFloat(ethPrice.price)).toString();
}

module.exports = { getPriceNftTransaction };
