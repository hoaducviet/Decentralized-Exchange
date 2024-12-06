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

async function exchangeTokenAuto() {
  const pools = await Pool.find();
  const rand2 = Math.floor(Math.random() * pools.length);
  const rand3 = Math.floor(Math.random() * 500);
  const rand4 = Math.floor(Math.random() * 2);
  const pool = pools[rand2];

  const token = await Token.findById(rand4 ? pool.token1_id : pool.token2_id);
  const tokenTwo = await Token.findById(pool.token2_id);
  const value = ethers.parseUnits(rand3.toString(), token.decimals);

  const contract = new ethers.Contract(
    pool.address,
    tokenTwo.symbol === "ETH" ? LiquidityPoolETH.abi : LiquidityPool.abi,
    wallet
  );
  const req = mockReq({
    type: "Swap Token",
    from_wallet: wallet.address,
    to_wallet: pool.address,
    pool_id: pool._id,
    from_token_id: token._id,
    to_token_id: rand4 ? pool.token2_id : pool.token1_id,
    amount_in: rand3,
  });
  const res = mockRes();
  await TransactionController.addTokenTransaction(req, res);
  const newTransaction = res.data;

  if (token.symbol !== "ETH") {
    try {
      const contractToken = new ethers.Contract(
        token.address,
        TokenERC20.abi,
        wallet
      );

      const nonce1 = await getNonce();
      const approveTX1 = await contractToken.approve(pool.address, value, {
        nonce: nonce1,
      });
      await approveTX1.wait();
      await new Promise((resolve) => setTimeout(resolve, 300));

      const nonce2 = await getNonce();
      const receipt = await contract.swapToken(token.address, value, {
        nonce: nonce2,
      });
      await receipt.wait();
      await new Promise((resolve) => setTimeout(resolve, 300));

      const req = mockReq({
        _id: newTransaction._id,
        receipt_hash: receipt.hash,
      });
      const res = mockRes();
      await TransactionController.updateTokenTransaction(req, res);

      console.log(nonce2, receipt.hash);
      return;
    } catch (error) {
      console.log("Exchange auto: ", error);
    }
  } else {
    try {
      const nonce2 = await getNonce();
      const receipt = await contract.swapToken(token.address, BigInt(0), {
        nonce: nonce2,
        value: value,
      });
      await receipt.wait();
      console.log(nonce2, receipt.hash);

      const req = mockReq({
        _id: newTransaction._id,
        receipt_hash: receipt.hash,
      });
      const res = mockRes();
      await TransactionController.updateTokenTransaction(req, res);

      return;
    } catch (error) {
      console.log("Exchange auto: ", error);
    }
  }
}

module.exports = { exchangeTokenAuto };
