const TokenPrice = require("../models/TokenPrice.js");

async function getPriceTokenTransaction(token, amountIn) {
  if (token.symbol === "USD") {
    return amountIn;
  }

  const tokenPrice = await TokenPrice.findOne({ token_id: token._id })
    .sort({ createdAt: -1 })
    .exec();
  return (parseFloat(amountIn) * parseFloat(tokenPrice.price)).toString();
}

module.exports = { getPriceTokenTransaction };
