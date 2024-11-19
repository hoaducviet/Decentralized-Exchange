const Pool = require("../models/Pool.js");
const Reserve = require("../models/Reserve.js");

async function getPriceTokenTransaction(fromToken, amountIn) {
  const pool_Usd_Eth = await Pool.findOne({ name: "USD/ETH" }).lean();
  const reserve_Usd_Eth = (
    await Reserve.find({ pool_id: pool_Usd_Eth._id })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean()
  )[0];

  if (fromToken.symbol === "ETH") {
    return (
      parseFloat(amountIn) *
      (parseFloat(reserve_Usd_Eth.reserve_token1) /
        parseFloat(reserve_Usd_Eth.reserve_token2))
    ).toString();
  } else if (fromToken.symbol === "USD") {
    return amountIn;
  } else {
    const pool_Token_Eth = await Pool.findOne({
      name: `${fromToken.symbol}/ETH`,
    }).lean();

    const reserve_Token_Eth = (
      await Reserve.find({
        pool_id: pool_Token_Eth._id,
      })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean()
    )[0];

    return (
      parseFloat(amountIn) *
      (parseFloat(reserve_Token_Eth.reserve_token2) /
        parseFloat(reserve_Token_Eth.reserve_token1)) *
      (parseFloat(reserve_Usd_Eth.reserve_token1) /
        parseFloat(reserve_Usd_Eth.reserve_token2))
    ).toString();
  }
}

module.exports = { getPriceTokenTransaction };
