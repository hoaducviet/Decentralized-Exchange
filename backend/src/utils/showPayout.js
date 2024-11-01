const axios = require("axios");

async function showPayout(accessToken, payoutId) {
  try {
    const response = await axios({
      url: `https://api-m.sandbox.paypal.com/v1/payments/payouts/${payoutId}?page=1&page_size=5&total_required=true`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw new Error("Failed to show payout");
  }
}

module.exports = { showPayout };
