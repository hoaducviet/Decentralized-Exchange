const User = require("../models/User");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class UserController {
  async insertUser(req, res) {}
  async getUserAll(req, res) {}
  async getUserById(req, res) {}
  async deleteUserById(req, res) {}
}

module.exports = new UserController();
