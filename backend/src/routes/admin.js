const express = require("express");
const router = express.Router();

const SiteController = require("../controllers/SiteController");
const AccountController = require("../controllers/AccountController");

//Account
router.get("/accounts", AccountController.getAllAccount);
router.post("/insert/account", AccountController.insertAccount);
router.patch("/update/account", AccountController.updateInfoAccount);
router.patch("/delete/account", AccountController.deleteAccount);

router.get("/search", SiteController.search);

module.exports = router;
