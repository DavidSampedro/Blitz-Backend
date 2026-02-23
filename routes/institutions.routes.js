/*const router = require("express").Router();
const controller = require("../controllers/institutions.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, controller.createInstitution);
router.get("/", auth, controller.getInstitutions);
router.get("/:id", auth, controller.getOne);
router.put("/:id", auth, controller.updateInstitution);
router.delete("/:id", auth, controller.deleteInstitution);

// Aquí definimos la sub-ruta raíz que se colgará de /api/institutions
router.get("/", controller.getInstitutions);
router.post("/", controller.createInstitution);
router.get("/:id", controller.getOne);
router.put("/:id", controller.updateInstitution);
router.delete("/:id", controller.deleteInstitution);

module.exports = router;
*/

const router = require("express").Router();
const controller = require("../controllers/institutions.controller");
const auth = require("../middleware/auth.middleware");

// Aplicamos el middleware a nivel de router para no escribirlo en cada línea
// (Como desactivamos la validación real en el archivo auth.middleware.js, esto es seguro)
router.use(auth);

// --- Rutas de Gestión General ---
router.get("/", controller.getInstitutions);           // Listar todas
router.post("/", controller.createInstitution);         // Crear nueva
router.get("/:id", controller.getOne);                 // Obtener una por ID
router.put("/:id", controller.updateInstitution);      // Actualizar
router.delete("/:id", controller.deleteInstitution);   // Eliminar

// --- Rutas de Relación (Específicas) ---
// Esta es la ruta que usamos para ver las instituciones de un grupo específico
router.get("/group/:groupId", controller.getInstitutionsByGroup);

module.exports = router;