const fs = require("fs");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const FactoryToken = require("../ignition/modules/FactoryToken");

const tokensBuild = require("../tokensBuild.json");

async function main() {
  const { factoryToken } = await hre.ignition.deploy(FactoryToken);
  console.log(`Factory deployed to: ${await factoryToken.getAddress()}`);

  await Promise.all(
    tokensBuild.map(async (token) => {
      const receipt = await factoryToken.createToken(
        token.name,
        token.ticker,
        token.img,
        token.decimals,
        process.env.ACCOUT_ADDRESS_HARDHAT,
        ethers.parseUnits("90000000", token.decimals)
      ); // Gọi hàm launch
      await receipt.wait(); // Chờ giao dịch hoàn thành
      console.log(ethers.parseUnits("90000000", token.decimals));
      console.log(`Token launched! Transaction hash: ${receipt.hash}`);
    })
  );

  const allTokens = await factoryToken.getAllTokens();

  // Lưu thông tin token vào mảng
  const allTokensData = allTokens.map((item) => ({
    name: item[0],
    symbol: item[1],
    img: item[2],
    decimals: Number(item[3]),
    owner: item[4],
    address: item[5],
  }));

  const jsonData = JSON.stringify(allTokensData, null, 2); // Định dạng

  // Ghi dữ liệu ra file JSON
  fs.writeFile("tokens.json", jsonData, (err) => {
    if (err) {
      console.error("Error writing file", err);
    } else {
      console.log("File has been written");
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
