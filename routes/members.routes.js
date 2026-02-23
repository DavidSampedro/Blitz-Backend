const express = require("express");
const router = express.Router();
const membersController = require("../controllers/members.controller");

// Ruta para obtener integrantes de un grupo específico
router.get("/group/:groupId", membersController.getMembersByGroup);

// Ruta para agregar un nuevo integrante
router.post("/", membersController.addMember);

// Ruta para eliminar un integrante
router.delete("/:id", membersController.deleteMember);

module.exports = router;