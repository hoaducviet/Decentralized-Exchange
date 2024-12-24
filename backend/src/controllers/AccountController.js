const Account = require("../models/Account");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class AccountController {
  async insertAccount(req, res) {
    try {
      const { address, role } = req.body;
      const newAccount = await Account({ address, role, active: true });
      await newAccount.save();

      return res.status(200).json(mongooseToObject(newAccount));
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error create new Account" });
    }
  }
  async getAllAccount(req, res) {
    try {
      const accounts = await Account.find();
      if (!accounts.length) {
        return res.status(404).json({ message: "Account's is null" });
      }
      return res.status(200).json(mutipleMongooseToObject(accounts));
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Account" });
    }
  }
  async deleteAccount(req, res) {}
  async updateInfoAccount(req, res) {}
}

module.exports = new AccountController();
