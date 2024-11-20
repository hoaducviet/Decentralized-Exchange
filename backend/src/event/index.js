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

console.log("Normal: ", eventTopics);

async function checkEvent(receiptHash, provider) {
  try {
    // Lấy receipt của giao dịch
    const receipt = await provider.getTransactionReceipt(receiptHash);
    if (!receipt) {
      console.log("Receipt không tồn tại");
      return;
    }

    console.log("Receipt:", receipt);

    // Kiểm tra sự kiện trong logs của giao dịch
    if (receipt.logs && receipt.logs.length > 0) {
      console.log("Sự kiện được phát ra:", receipt.logs);
      receipt.logs.forEach((log, index) => {
        // console.log(`Log ${index + 1}:`, log);
        if (log.topics[0] === eventTopics[0]) {
          console.log(`Log ${index + 1}:`, log.data);

          const abiCoder = ethers.AbiCoder.defaultAbiCoder();
          const decodedEvent = abiCoder.decode(
            ["uint256", "uint256", "uint256"],
            log.data
          );
          const [amount1, amount2, liquidityTokens] = decodedEvent;
          console.log(
            `Liquidity added by ${log.topics[1]}, amount1: ${amount1}, amount2: ${amount2}, lpt: ${liquidityTokens}`
          );
        }
      });
    } else {
      console.log("Không có sự kiện nào trong giao dịch này.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy receipt:", error);
  }
}

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
  const reserve2 = ethers.formatUnits(value2, pool.token2_id.decimals2);

  const result = await new Reserve({
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
