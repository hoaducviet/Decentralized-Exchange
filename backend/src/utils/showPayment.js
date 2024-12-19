const axios = require("axios");

async function showPayment(accessToken, orderId) {
  try {
    const response = await axios.get(
      `https://api-m.sandbox.paypal.com/v2/payments/authorizations/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw new Error("Failed to show payout");
  }
}

module.exports = { showPayment };
