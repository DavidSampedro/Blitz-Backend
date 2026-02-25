const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

// La ruta base ya se define en server.js (/api/reports)
// Aquí solo definimos el punto final
router.get('/global', reportsController.getGlobalReport);

module.exports = router;