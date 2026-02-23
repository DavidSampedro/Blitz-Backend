const express = require("express");
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


module.exports = router;