const { getAccessToken } = require("../utils/getAccessToken.js");
const { createPayout } = require("../utils/createPayout.js");

class PaymentController {
  async paypal(req, res) {
    try {
      const token = await getAccessToken();
      const payout = await createPayout(token);
      console.log(payout);
      return res.json(payout);
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new PaymentController();
