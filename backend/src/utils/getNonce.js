const { provider } = require("../config/provider");
const { wallet } = require("../controllers/WalletController");

async function getNonce() {
  try {
    return await provider.getTransactionCount(wallet.address, "latest");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getNonce };
