const router = require("express").Router();

const socialController = require("../../controller/social");

router.get("/", socialController.get);
router.post("/", socialController.create);

module.exports = router;
