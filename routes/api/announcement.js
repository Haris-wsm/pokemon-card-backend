const router = require("express").Router();

const announceController = require("../../controller/announcement");

// For Authentication Admin
router.get("/", announceController.get);
router.post("/", announceController.create);

module.exports = router;
