const axios = require("axios");

async function fetchDataURI({ uri }) {
  try {
    if (!uri) {
      return { data: null };
    }
    const response = await axios.get(uri, { timeout: 20000 });

    if (response.status !== 200) {
      return { data: null };
    }
    return response.data;
  } catch (error) {
    console.log(error);
    return { data: null };
  }
}

module.exports = { fetchDataURI };
