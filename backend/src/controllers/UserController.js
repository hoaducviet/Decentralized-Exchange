const User = require("../models/User");
const TokenController = require("./TokenController.js");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class UserController {
  async insertUser(req, res) {
    await TokenController.updateTotalSupply();
  }
  async getUserAll(req, res) {}
  async getUserById(req, res) {}
  async deleteUserById(req, res) {}
}

module.exports = new UserController();
