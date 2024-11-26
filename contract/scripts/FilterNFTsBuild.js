const fs = require("fs");
const path = require("path");
const collections = require("../assets/collections.json");

async function main() {
  collections.map((item) => {
    const folderPath = `../data/metadata/${item.name}`;
    const files = fs.readdirSync(folderPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    const nfts = jsonFiles.map((file) => {
      const filePath = path.join(folderPath, file);
      const fileData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileData);
    });
    const collections = nfts
      .map(({ token_id, token_uri }) => ({
        token_id,
        token_uri,
      }))
      .sort((a, b) => parseInt(a.token_id) - parseInt(b.token_id));

    const jsonData = JSON.stringify(collections, null, 2);
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
