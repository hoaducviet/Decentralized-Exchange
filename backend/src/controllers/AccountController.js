const Account = require("../models/Account");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class AccountController {
  async insertAccount(req, res) {
    try {
      const { address, role } = req.body;
      const account = await Account.findOne({ address });
      if (account) {
        return res.status(404).json({ message: "Account existed!" });
      }
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
  async deleteAccount(req, res) {
    try {
      const { _id } = req.body;
      const account = await Account.findById(_id);
      if (!account) {
        return res.status(404).json({ message: "Account's is null" });
      }
      await Account.delete({ _id });
      return res.status(200).json({ message: "Deleted Account" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Account" });
    }
  }
  async updateInfoAccount(req, res) {
    try {
      const newInfo = req.body;
      const account = await Account.findOne({ address: newInfo.address });
      if (!account) {
        return res.status(404).json({ message: "Account is null" });
      }

      await Account.updateOne({ _id: newInfo._id }, newInfo);
      return res.status(200).json({ message: "Update info successful" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error get Account" });
    }
  }
}

module.exports = new AccountController();
