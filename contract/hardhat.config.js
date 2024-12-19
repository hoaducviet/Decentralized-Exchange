const { extendEnvironment } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("dotenv").config();

extendEnvironment((hre) => {
  hre.hi = "Hello, hardhat";
});

// Định nghĩa một task có tên là 'accounts'
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  accounts.forEach((account) => {
    console.log(account.address);
  });
});

task("envtest", async (taskArgs, hre) => {
  console.log(hre.hi);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      ignition: {
        gas: 40000000, // Gas mặc định cho giao dịch
        gasPrice: 20000000000, // Giá gas mặc định (20 gwei)
        blockGasLimit: 50000000,
        maxFeePerGasLimit: 50_000_000_000n, // 50 gwei
        maxPriorityFeePerGas: 2_000_000_000n, // 2 gwei
        disableFeeBumping: false,
      },
    },
    // hardhat: {
    //   forking: {
    //     url: process.env.ALCHEMY_MAINNET,
    //   },
    // },
    // sepolia: {
    //   url: process.env.ALCHEMY_SEPOLIA_URL,
    //   accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  ignition: {
    blockPollingInterval: 1_000,
    timeBeforeBumpingFees: 3 * 60 * 1_000,
    maxFeeBumps: 4,
    requiredConfirmations: 1,
    disableFeeBumping: false,
  },
};
