const axios = require("axios");

async function getAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.SECRET_KEY;

  try {
    const response = await axios({
      url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      data: "grant_type=client_credentials",
    });

    const accessToken = response.data.access_token;
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = { getAccessToken };
