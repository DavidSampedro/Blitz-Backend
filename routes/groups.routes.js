/*const router = require("express").Router();
const controller = require("../controllers/groups.controller");

router.get("/", controller.getGroups);
router.post("/", controller.createGroup);

module.exports = router;
*/

const express = require("express");
const router = express.Router();
//const authMiddleware = require("../middleware/auth.middleware"); // Para proteger con token
const { getGroups, createGroup, deleteGroup } = require("../controllers/groups.controller");

// Aplicamos el middleware para que solo usuarios logueados (con Token) puedan usar esto
//router.use(authMiddleware);

// Definimos los Endpoints
router.get("/", getGroups);             // Cuando React hace un GET
router.post("/", createGroup);          // Cuando React hace un POST (Guardar)
router.delete("/:id", deleteGroup);     // Cuando React hace un DELETE (Papelera)

module.exports = router;
