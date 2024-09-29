require("@nomicfoundation/hardhat-toolbox");

// Định nghĩa một task có tên là 'accounts'
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  
  accounts.forEach(account => {
    console.log(account.address);
  });
});


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  
};
