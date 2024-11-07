const axios = require("axios");
async function getOrderId(accessToken, address, value) {
  try {
    const timestamp = new Date().getTime();
    const invoiceId = `${address}-${timestamp}`;
    const response = await axios({
      url: "https://api.sandbox.paypal.com/v2/checkout/orders",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: `${value}`,
              breakdown: {
                item_total: { currency_code: "USD", value: `${value}` },
              },
            },
            custom_id: `${address}`,
            invoice_id: invoiceId,
            items: [
              {
                name: "USD Token",
                description: "The token digital of usd",
                unit_amount: { currency_code: "USD", value: `${value}` },
                quantity: "1",
                category: "DIGITAL_GOODS",
              },
            ],
          },
        ],
      },
    });
    return response.data;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw new Error("Failed to create order id");
  }
}

module.exports = { getOrderId };
