const axios = require("axios");

const gateways = [
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://infura-ipfs.io/ipfs/",
  "https://ipfs.moralis.io:2053/ipfs/",
];

async function fetchDataURI({ uri }) {
  try {
    if (!uri) {
      return { data: null };
    }

    if (uri.includes("/ipfs/")) {
      let [url, cid] = uri.split("/ipfs/");
      url = `${url}/ipfs/`;
      const allGateways = [url, ...gateways];

      for (const gateway of allGateways) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const response = await axios.get(`${gateway}${cid}`, {
            timeout: 20000,
          });

          if (response.status === 200) {
            console.log(`${gateway}${cid}`);
            return response.data;
          }
        } catch (error) {
          console.log(`${gateway} is error: `, error.message);
          return {data: null}
        }
      }
    }

    const response = await axios.get(uri, { timeout: 20000 });
    if (response.status === 200) {
      console.log(uri);
      return response.data;
    }

    return { data: null };
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { fetchDataURI };
