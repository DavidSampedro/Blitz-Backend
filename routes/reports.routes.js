const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

router.get("/global", reportsController.getGlobalReport);

module.exports = router;