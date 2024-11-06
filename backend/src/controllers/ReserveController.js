const Reserve = require("../models/Reserve");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class ReserveController {
  async insertReserve(req, res) {}
  async getReserveAll(req, res) {}
  async getReserveById(req, res) {}
  async deleteReserveById(req, res) {}
}

module.exports = new ReserveController();
