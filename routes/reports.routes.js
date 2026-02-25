const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

// Solo definimos el "sub-camino". 
// Como en server.js ya pusiste "/api/reports", esto completa la ruta a "/api/reports/global"
router.get("/global", reportsController.getGlobalReport);

module.exports = router;