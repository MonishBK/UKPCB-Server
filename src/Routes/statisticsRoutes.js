const express = require('express');
const router = express.Router();
const Authenticate = require("../middlewares/authenticate");
const {Statistics} = require("../Controllers/StatisticsControllers")


// get all Statistics
router.get('', Authenticate, Statistics);

module.exports = router;
