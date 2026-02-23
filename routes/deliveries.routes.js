/*const express = require("express");
const router = require("express").Router();
const controller = require("../controllers/deliveries.controller");
const auth = require("../middleware/auth.middleware");


router.get("/progress", auth, controller.progress);
router.get("/groups", auth, controller.byGroup);
router.post("/", auth, controller.createDelivery);
router.get("/", auth, controller.getDeliveries);
router.get("/", controller.getDeliveries);
router.post("/", controller.createDelivery);
router.get("/total", auth, controller.totalGlobal);
router.delete("/:id", controller.deleteDelivery);


module.exports = router;*/

const express = require("express");
const router = express.Router();
const controller = require("../controllers/deliveries.controller");

// Eliminamos "auth" de las rutas para permitir el acceso desde el Frontend publicado
router.get("/progress", controller.progress);
router.get("/groups", controller.byGroup);
router.get("/total", controller.totalGlobal);

// Rutas base para obtener y crear entregas
router.get("/", controller.getDeliveries);
router.post("/", controller.createDelivery);

// Ruta para eliminar
router.delete("/:id", controller.deleteDelivery);

module.exports = router;