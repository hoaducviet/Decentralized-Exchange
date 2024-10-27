const express = require("express");
const app = express();
const port = 3002;
const fs = require("fs");

const Moralis = require("moralis").default;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  try {
    await Moralis.start({
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjRjN2ZjYmNiLWM3NmEtNGQzMi04Zjc5LWNmNjVjMGQ1OWVlZiIsIm9yZ0lkIjoiNDEzNTYxIiwidXNlcklkIjoiNDI1MDA2IiwidHlwZUlkIjoiMjA1YmU3YTMtZTU0OC00OTRkLWIxOTMtZWRhZGVkYzc2ZTk5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzAwNDUwNzMsImV4cCI6NDg4NTgwNTA3M30.qVBnpCaRxcT8ZYn6fvOX1br_vWMGw3H0Wjg5Cwc0mBM",
    });

    const writePromises = [];

    for (let i = 1; i <= 20; i++) {
      let tokenId = i;
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        chain: "0x1",
        format: "decimal",
        normalizeMetadata: true,
        mediaItems: false,
        address: "0xc4973de5ee925b8219f1e74559fb217a8e355ecf",
        tokenId: tokenId.toString(),
      });

      console.log(response.raw);

      let dir = `./metadata/${response.raw.name}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let jsonData = JSON.stringify(response.raw, null, 2);
      // Ghi dữ liệu ra file JSON
      const writePromise = new Promise((resolve, reject) => {
        fs.writeFile(`${dir}/${tokenId}.json`, jsonData, (err) => {
          if (err) {
            console.error("Error writing file", err);
            reject(err); // Reject Promise nếu có lỗi
          } else {
            console.log(`File ${tokenId}.json has been written`);
            resolve(); // Resolve Promise khi ghi file thành công
          }
        });
      });

      writePromises.push(writePromise);
    }

    await Promise.all(writePromises);
  } catch (e) {
    console.error(e);
  }

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

// Call startServer()
startServer();
