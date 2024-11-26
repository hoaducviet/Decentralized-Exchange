const fs = require("fs");
const path = require("path");

const folderPath = "../data/collections";

async function main() {
  const files = fs.readdirSync(folderPath);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  //   Load dữ liệu từ mỗi file JSON và lưu vào một mảng
  const collectionsRaw = jsonFiles.map((file) => {
    const filePath = path.join(folderPath, file);
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  });

  const results = collectionsRaw.map(({ name, symbol, uri }) => ({
    name,
    symbol,
    uri,
  }));
  const jsonData = JSON.stringify(results, null, 2); // Định dạng

  // Ghi dữ liệu ra file JSON
  fs.writeFile("./assets/collectionsBuild.json", jsonData, (err) => {
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
