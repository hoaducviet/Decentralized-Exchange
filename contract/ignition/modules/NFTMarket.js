// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
const { ethers } = require("hardhat");

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTMarket", (m) => {
  const nftMarket = m.contract("NFTMarket", []);

  return { nftMarket };
});
