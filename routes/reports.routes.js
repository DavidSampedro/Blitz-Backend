const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");
const reportRoutes = require('./routes/report.routes');
// ...
app.use('/api/reports', reportRoutes); // Esto crea la ruta /api/reports/global
router.get("/global", reportsController.getGlobalReport);

module.exports = router;