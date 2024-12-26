const { provider, wallet } = require("../config/provider");

async function getNonce() {
  try {
    return await provider.getTransactionCount(wallet.address, "latest");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getNonce };
