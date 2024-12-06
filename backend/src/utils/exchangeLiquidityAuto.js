const Pool = require("../models/Pool.js");
const Token = require("../models/Token.js");
const TokenERC20 = require("../artifacts/TokenERC20.json");
const LiquidityPool = require("../artifacts/LiquidityPool.json");
const LiquidityPoolETH = require("../artifacts/LiquidityPoolETH.json");
const { provider } = require("../config/provider/index.js");
const { wallet } = require("../controllers/WalletController.js");
const { ethers } = require("ethers");

const TransactionController = require("../controllers/TransactionController.js");
const { getNonce } = require("./getNonce.js");

const mockReq = (data) => ({
  body: data,
});

const mockRes = () => {
  const res = {};
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

async function exchangeLiquidityAuto() {
  const pools = await Pool.find();
  const rand2 = Math.floor(Math.random() * pools.length);
  const rand3 = Math.floor(Math.random() * 100) + 1;
  const pool = pools[rand2];

  const tokenOne = await Token.findById(pool.token1_id);
  const tokenTwo = await Token.findById(pool.token2_id);
  const isEth = tokenTwo.symbol === "ETH";

  const value1 = ethers.parseUnits(rand3.toString(), tokenOne.decimals);
  const value2 = ethers.parseUnits(rand3.toString(), tokenTwo.decimals);

  const contract = new ethers.Contract(
    pool.address,
    isEth ? LiquidityPoolETH.abi : LiquidityPool.abi,
    wallet
  );

  const contractToken1 = new ethers.Contract(
    tokenOne.address,
    TokenERC20.abi,
    wallet
  );
  const req = mockReq({
    type: "Add Liquidity",
    wallet: wallet.address,
    pool_id: pool._id,
    token1_id: tokenOne._id,
    token2_id: tokenTwo._id,
  });

  const res = mockRes();
  await TransactionController.addLiquidityTransaction(req, res);
  const newTransaction = res.data;

  try {
    const nonce1 = await getNonce();
    const approveTX1 = await contractToken1.approve(pool.address, value1, {
      nonce: nonce1,
    });
    await approveTX1.wait();
  } catch (error) {
    console.log(error);
  }

  if (!isEth) {
    const contractToken2 = new ethers.Contract(
      tokenTwo.address,
      TokenERC20.abi,
      wallet
    );

    try {
      const nonce2 = await getNonce();
      const approveTX2 = await contractToken2.approve(pool.address, value2, {
        nonce: nonce2,
      });
      await approveTX2.wait();

      const nonce3 = await getNonce();
      const receipt = await contract.addLiquidity(value1, value2, {
        nonce: nonce3,
      });
      await receipt.wait();

      const req = mockReq({
        _id: newTransaction._id,
        receipt_hash: receipt.hash ?? "",
      });
      const res = mockRes();
      await TransactionController.updateLiquidityTransaction(req, res);

      console.log("Time 3: ", nonce3, receipt.hash);
      return;
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const nonce3 = await getNonce();
      const receipt = await contract.addLiquidity(value1, {
        nonce: nonce3,
        value: value2,
      });
      await receipt.wait();

      const req = mockReq({
        _id: newTransaction._id,
        receipt_hash: receipt.hash ?? "",
      });
      const res = mockRes();
      await TransactionController.updateLiquidityTransaction(req, res);

      console.log("ETH: ", nonce3, receipt.hash);
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { exchangeLiquidityAuto };
