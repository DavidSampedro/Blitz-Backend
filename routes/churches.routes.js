const router = require("express").Router();
const controller = require("../controllers/churches.controller");
//const auth = require("../middleware/auth.middleware");

//router.post("/", auth, controller.createChurch);
//router.get("/", auth, controller.getChurches);
//router.get("/:id", auth, controller.getOne);
//router.put("/:id", auth, controller.updateChurch);
//router.delete("/:id", auth, controller.deleteChurch);

router.get("/", controller.getChurches);
router.post("/", controller.createChurch);
router.get("/:id", controller.getOne);
router.delete("/:id", controller.deleteChurch);

module.exports = router;