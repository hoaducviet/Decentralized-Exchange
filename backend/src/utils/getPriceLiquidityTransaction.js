const TokenPrice = require("../models/TokenPrice.js");

async function getPriceLiquidityTransaction(token1, token2, amount1, amount2) {
  const token1Price = await TokenPrice.findOne({ token_id: token1._id })
    .sort({ createdAt: -1 })
    .exec();
  const token2Price = await TokenPrice.findOne({ token_id: token2._id })
    .sort({ createdAt: -1 })
    .exec();
  return (
    parseFloat(amount1) * parseFloat(token1Price.price) +
    parseFloat(amount2) * parseFloat(token2Price.price)
  ).toString();
}

module.exports = { getPriceLiquidityTransaction };
