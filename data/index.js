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

    const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
      chain: "0x1",
      address:  "0xef0182dc0574cd5874494a120750fd222fdb909a",
    });

    console.log(response.raw);

    let dir = `./collections`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let jsonData = JSON.stringify(response.raw, null, 2);
    // Ghi dữ liệu ra file JSON

    fs.writeFile(`${dir}/${response.raw.name}.json`, jsonData, (err) => {
      if (err) {
        console.error("Error writing file", err);
      } else {
        console.log(`File ${response.raw.name}.json has been written`);
      }
    });
  } catch (e) {
    console.error(e);
  }

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

// Call startServer()
startServer();
