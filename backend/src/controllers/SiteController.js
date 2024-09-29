const { movies } = require("../data/index.js");

const Media = require("../models/Media");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

class SiteController {
  async search(req, res) {
    try {
      const q = req.query.q;
      
      if (!q) {
        return res.status(400).json({ message: "Missing requires field" });
      }
      
      const results = await Media.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      
      console.log(results);
      return res.status(200).json({ data: mutipleMongooseToObject(results) });
    } catch (error) {
      console.error("Error avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new SiteController();
