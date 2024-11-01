const axios = require("axios");
async function createPayout(accessToken, value) {
  try {
    const response = await axios({
      url: "https://api.sandbox.paypal.com/v1/payments/payouts",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        sender_batch_header: {
          sender_batch_id: `Payouts_Dex_${Date.now()}`,
          email_subject: "You have a payout!",
          email_message:
            "You have received a payout! Thanks for using our service!",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: { value: `${value}`, currency: "USD" },
            note: "Thanks for your patronage!",
            sender_item_id: `Dex_Item_${Date.now()}`,
            receiver: "viethoaduc.12@gmail.com", // Thay bằng email của người nhận
          },
        ],
      },
    });
    return response.data;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw new Error("Failed to create payout");
  }
}

module.exports = { createPayout };
