const fs = require("fs");
const collections = require("../assets/collectionsBuild.json");

const listNfts = collections.filter(
  (item) => item.name !== "Nyan Balloon" && item.name !== "CryptoPunks"
);
async function main() {
  listNfts.map((item) => {
    const data = [];
    for (let index = 0; index < item.number; index++) {
      if (index >= 2000) {
        break;
      }
      data.push({
        token_id: index,
        token_uri: `${index}${item.end_url}`,
      });
    }

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(`./assets/NFT/${item.name}.json`, jsonData, (err) => {
      if (err) {
        console.error("Error writing file", err);
      } else {
        console.log("File has been written");
      }
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
