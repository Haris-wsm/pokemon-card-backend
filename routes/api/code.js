const router = require("express").Router();

const codeController = require("../../controller/code");

router.post("/list", codeController.deleteCodeList);

module.exports = router;
