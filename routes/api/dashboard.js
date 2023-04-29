const router = require("express").Router();

const dashbaordController = require("../../controller/dashboard");

router.get("/", dashbaordController.summary);

module.exports = router;
