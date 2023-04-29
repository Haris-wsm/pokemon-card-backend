const router = require("express").Router();

const authController = require("../../controller/auth");
const middlewareValidator = require("../../middleware/auth");

router.post("/login", middlewareValidator.login(), authController.login);
router.post("/register", middlewareValidator.login(), authController.register);
// router.post("/register", authController.register);

module.exports = router;
