const Token = require("../models/Token.js");

async function getPriceTokenUSDtoETH(amountIn) {
  const token = await Token.findOne({ symbol: "ETH" });
  const amount =
    parseFloat(amountIn) > 0 ? parseFloat(amountIn) : -parseFloat(amountIn);
  return (amount / parseFloat(token.price)).toFixed(6);
}

module.exports = { getPriceTokenUSDtoETH };
