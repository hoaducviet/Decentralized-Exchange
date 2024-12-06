const { provider } = require("../config/provider");
const { wallet } = require("../controllers/WalletController");

async function getNonce() {
  try {
    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    return nonce;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getNonce };
