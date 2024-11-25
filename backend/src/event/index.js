const { ethers } = require("ethers");
const Pool = require("../models/Pool");
const Token = require("../models/Token");
const Reserve = require("../models/Reserve");
const util = require("util");
const WebSocket = require("ws");

const TokenERC20 = require("../artifacts/TokenERC20.json");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const LPToken = require("../artifacts/LPToken.json");
const NFTCollection = require("../artifacts/NFTCollection.json");

const eventAbi = [
  "event LiquidityAdded( address indexed provider, uint256 amount1, uint256 amount2, uint256 liquidityTokens)",
  "event LiquidityRemoved( address indexed provider, uint256 amount1, uint256 amount2, uint256 liquidityTokens)",
  "event TokensSwapped( address indexed provider, address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut)",
];

const eventTopics = eventAbi.map(
  (abi) => ethers.EventFragment.from(abi).topicHash
);

async function addReserves(log, provider) {
  const pool = await Pool.findOne({ address: log.address })
    .select("_id name address")
    .populate({
      path: "token1_id",
      select: "_id decimals",
      model: "token",
    })
    .populate({
      path: "token2_id",
      select: "_id decimals",
      model: "token",
    })
    .exec();

  const contract = new ethers.Contract(
    log.address,
    LiquidityPool.abi,
    provider
  );
  const value1 = await contract.reserve1();
  const value2 = await contract.reserve2();
  const reserve1 = ethers.formatUnits(value1, pool.token1_id.decimals);
  const reserve2 = ethers.formatUnits(value2, pool.token2_id.decimals);

  await new Reserve({
    pool_id: pool._id,
    reserve_token1: reserve1,
    reserve_token2: reserve2,
  }).save();

}

async function event(wsProvider) {
  const pools = await Pool.find().select("_id address").exec();
  const addressLiquiditys = pools.map((item) => item.address);

  const filter = {
    address: addressLiquiditys,
    topics: [eventTopics],
  };

  wsProvider.on(filter, (log, event) => {
    console.log("Log:", log);
    addReserves(log, wsProvider);
  });
}

module.exports = event;
