// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
const { ethers } = require("hardhat");

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTMarket", (m) => {
  const initialOwner = m.getParameter(
    "initialOwner",
    process.env.ACCOUT_ADDRESS_HARDHAT
  );
  const nftMarket = m.contract("NFTMarket", [initialOwner]);

  return { nftMarket };
});
