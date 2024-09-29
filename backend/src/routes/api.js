const express = require("express");
const router = express.Router();

const SiteController = require("../controllers/SiteController");

//Site
router.get("/search", SiteController.search);


module.exports = router;
